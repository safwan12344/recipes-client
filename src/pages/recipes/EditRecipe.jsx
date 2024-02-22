/* eslint-disable react/prop-types */
import { useRef, useState } from "react";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import { Table, Column, HeaderCell, Cell } from "rsuite-table";
// import propTypes from "prop-types"
import "rsuite-table/dist/css/rsuite-table.min.css"; // or 'rsuite-table/dist/css/rsuite-table.css'
import axios from "../../utils/axios";
import authState from "../../states/auth";
import { useSnapshot } from "valtio";
import categoriesState from "../../states/categories";
import Alert from "react-bootstrap/Alert";
import { /*Controller,*/ useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import "./EditRecipe.css";
import { useLocation, useNavigate } from "react-router-dom";

const schema = yup.object({
  name: yup
    .string()
    .required()
    .matches(/^[a-zA-Z\s\W]+$/, {
      message:
        "The name should contain either letters and special characters together or only letters",
    })
    .trim(),
  orderLink: yup.string().required(),
  description: yup.string().required(),
  category: yup.string().required(),
  time: yup.number().required(),
  preparation: yup.string().required(),
  files: yup
    .mixed()
    .nullable()
    .test({
      message: "image URL should be of type image",
      test: (file) => {
        if (!file || file.length == 0) {
          return true;
        }
        const ext = file[0].name.split(".")[1];
        const isValid = ["png"].includes(ext);
        return isValid;
      },
    })
    .test({
      message: `File too big, can't exceed 3MB`,
      test: (file) => {
        if (!file || file.length == 0) {
          return true;
        }
        const sizeLimit = 3;
        const totalSizeInMB = file[0].size / 1000000;
        const isValid = totalSizeInMB <= sizeLimit;
        return isValid;
      },
    }),
});

const ingrediantSchema = yup.object({
  ingredientName: yup
    .string()
    .required()
    .matches(/^[a-zA-Z\s\W]+$/, {
      message:
        "The name should contain either letters and special characters together or only letters",
    })
    .trim(),
  ingredientUnit: yup
    .string()
    .nullable()
    .matches(/^[a-zA-Z]*$/, { message: "You must enter only English letters" })
    .trim(),
  ingredientAmount: yup
    .number()
    .nullable()
    .transform((value) => (Number.isNaN(value) ? null : value))
    .when("ingredientUnit", (ingredientUnit, schema) => {
      if (ingredientUnit != "" && ingredientUnit != null)
        return schema.required("Must enter number");
      return schema;
    }),
});

function uuidv4() {
  return ([1e7] + -1e3 + -4e3 + -8e3 + -1e11).replace(/[018]/g, (c) =>
    (c ^ (crypto.getRandomValues(new Uint8Array(1))[0] & (15 >> (c / 4)))).toString(16),
  );
}

// eslint-disable-next-line react/prop-types
const EditCell = ({ rowData, dataKey, onChange, Input, ...props }) => {
  return (
    <Cell {...props}>
      {rowData.status === "EDIT"
        ? Input({
            defaultValue: rowData[dataKey],
            onChange: (event) => {
              onChange && onChange(rowData.id, dataKey, event.target.value);
            },
          })
        : rowData[dataKey]}
    </Cell>
  );
};

// eslint-disable-next-line react/prop-types
const ActionCell = ({ rowData, onClick, onDelete, ...props }) => {
  return (
    <Cell {...props}>
      <Button
        style={{ marginRight: 8 }}
        variant='outline-primary'
        size='sm'
        onClick={() => {
          // eslint-disable-next-line react/prop-types
          onClick && onClick(rowData.id);
        }}
      >
        {/*eslint-disable react/prop-types */ rowData.status === "EDIT" ? "Save" : "Edit"}
      </Button>

      <Button
        variant='outline-danger'
        size='sm'
        onClick={() => {
          // eslint-disable-next-line react/prop-types
          onDelete && onDelete(rowData.id);
        }}
      >
        Delete
      </Button>
    </Cell>
  );
};

export default function EditRecipe() {
  const { categories } = useSnapshot(categoriesState);
  const formRef = useRef(null);
  const navigate = useNavigate();
  const location = useLocation();
  const recipe = location.state.recipe;

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitted },
  } = useForm({
    defaultValues: {
      name: recipe.name,
      description: recipe.description,
      preparation: recipe.preparation.join("\r\n"),
      category: recipe.category,
      time: recipe.time,
      files: null,
      orderLink: recipe.orderLink,
    },
    resolver: yupResolver(schema),
  });

  const {
    register: registerIngrediant,
    handleSubmit: handleSubmitIngrediant,
    formState: { errors: errorsIngrediants },
    reset: resetIngredients,
  } = useForm({
    defaultValues: {
      ingredientAmount: null,
      ingredientUnit: null,
      ingredientName: "",
    },
    resolver: yupResolver(ingrediantSchema),
  });

  const [data, setData] = useState(recipe.ingredients.map((item) => ({ ...item, id: item._id })));

  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");

  const { token } = useSnapshot(authState);

  const addIngredient = ({ ingredientName, ingredientUnit, ingredientAmount }) => {
    const dataToAdd = {
      id: uuidv4(),
      name: ingredientName,
      unit: ingredientUnit ? ingredientUnit : null,
      amount: ingredientAmount ? Number(ingredientAmount) : null,
    };
    setData([...data, dataToAdd]);
    resetIngredients();
  };

  const handleChange = (id, key, value) => {
    const nextData = [...data];
    nextData.find((item) => item.id === id)[key] =
      key === "amount" && value ? Number(value) : value;

    setData(nextData);
  };

  const handleEditState = (id) => {
    const nextData = [...data];
    const activeItem = nextData.find((item) => item.id === id);
    activeItem.status = activeItem.status ? null : "EDIT";
    setData(nextData);
  };

  const handleDelete = (id) => {
    const nextData = data.filter((ingrediant) => ingrediant.id != id);
    setData(nextData);
  };
  const editRecepie = async (dataR) => {
    if (data.length == 0) {
      return;
    }
    const fd = new FormData();
    fd.append("name", dataR.name);
    fd.append("description", dataR.description);
    fd.append("category", dataR.category);
    fd.append("time", dataR.time);
    fd.append("preparation", dataR.preparation);
    fd.append("orderLink", dataR.orderLink);

    if (dataR.files?.length > 0) fd.append("file", dataR.files[0]);

    fd.append("ingredients", JSON.stringify(data));

    try {
      await axios.put(`${process.env.REACT_APP_API_URL}/recipes/${recipe._id}`, fd, {
        headers: {
          authorization: `TOKEN ${token}`,
        },
      });
      setShowAlert(true);
      setAlertMessage("recipe successfuly edited");

      setTimeout(() => {
        setShowAlert(false);
        setAlertMessage("");
        navigate(-1);
      }, 3000);
    } catch (error) {
      console.log(error);
      setShowAlert(true);
      setAlertMessage("Error: " + error.message);
      setTimeout(() => {
        setShowAlert(false);
        setAlertMessage("");
      }, 3000);
    }
  };

  const deleteRecipe = async () => {
    try {
      await axios.delete(`${process.env.REACT_APP_API_URL}/recipes/${recipe._id}`, {
        headers: {
          authorization: `TOKEN ${token}`,
        },
      });
      setAlertMessage("recipe successfuly deleted");

      setTimeout(() => {
        setShowAlert(false);
        navigate(-1);
      }, 3000);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div style={{ overflowY: "auto" }}>
      <h1> Edit recipe </h1>
      <Form ref={formRef} onSubmit={handleSubmit(editRecepie)}>
        <Form.Group className='mb-3' controlId='formRecipeName'>
          <Form.Label>Recipe name</Form.Label>
          <Form.Control {...register("name")} type='txt' placeholder='Enter name' />
          {errors.name?.message && <div style={{ color: "red" }}>{errors.name?.message}</div>}
        </Form.Group>
        <Form.Group className='mb-3' controlId='formDescription'>
          <Form.Label>Description </Form.Label>
          <Form.Control {...register("description")} type='txt' placeholder='Enter description' />
          {errors.description?.message && (
            <div style={{ color: "red" }}>{errors.description?.message}</div>
          )}
        </Form.Group>
        <Form.Group className='mb-3' controlId='formDescription'>
          <Form.Label>Time (minutes)</Form.Label>
          <Form.Control {...register("time")} type='number' placeholder='Enter Time' />
          {errors.time?.message && <div style={{ color: "red" }}>{errors.time?.message}</div>}
        </Form.Group>
        <Form.Group className='mb-3' controlId='formDescription'>
          <Form.Label>Preparation </Form.Label>
          <Form.Control
            {...register("preparation")}
            style={{ height: "150px" }}
            as='textarea'
            placeholder={"Add water to just cover" + "\n" + "Bring to a boil over medium-high."}
          />
          {errors.preparation?.message && (
            <div style={{ color: "red" }}>{errors.preparation?.message}</div>
          )}
        </Form.Group>
        <Form.Group className='mb-3' controlId='formDescription'>
          <div>
            <img width={120} height={120} src={recipe.imageURL} />
          </div>
          <Form.Label>Image</Form.Label>
          <Form.Control
            {...register("files")}
            type='file'
            accept='image/png'
            placeholder='upload image'
          />
          {errors.files?.message && <div style={{ color: "red" }}>{errors.files?.message}</div>}
        </Form.Group>

        <Form.Group className='mb-3' controlId='formOrderLink'>
          <Form.Label>Order Link</Form.Label>
          <Form.Control {...register("orderLink")} type='text' placeholder='Enter order link' />
          {errors.orderLink?.message && (
            <div style={{ color: "red" }}>{errors.orderLink?.message}</div>
          )}
        </Form.Group>

        <Form.Group className='mb-3' controlId='formRole'>
          <Form.Label>Category</Form.Label>
          <Form.Select {...register("category", { required: true })} defaultValue={""}>
            <option value='' disabled>
              Please choose category
            </option>
            {categories.map((category) => {
              return (
                <option key={category._id} value={category._id}>
                  {category.name}
                </option>
              );
            })}
          </Form.Select>
          {errors.category?.message && (
            <div style={{ color: "red" }}>{errors.category?.message}</div>
          )}
        </Form.Group>

        <Alert
          className='alert-float'
          onClose={() => {
            setShowAlert(false);
          }}
          transition={true}
          dismissible={true}
          show={showAlert}
          variant='success'
        >
          {alertMessage}
        </Alert>
      </Form>
      <Form style={{ marginBottom: 20 }} onSubmit={handleSubmitIngrediant(addIngredient)}>
        <Form.Group style={{ height: 90 }}>
          <p style={{ marginBottom: "1rem" }}>Add Ingredient</p>
          <div className='d-flex align-items-center' style={{ marginBottom: "1rem" }}>
            <div style={{ marginRight: 10, display: "flex", flexDirection: "column" }}>
              <Form.Control
                {...registerIngrediant("ingredientName")}
                type='txt'
                placeholder='Enter ingredient name'
              />

              <div style={{ color: "red" }}>
                {errorsIngrediants.ingredientName?.message ? (
                  errorsIngrediants.ingredientName?.message
                ) : (
                  <>&nbsp;</>
                )}
              </div>
            </div>

            <div style={{ marginRight: 10, display: "flex", flexDirection: "column" }}>
              <Form.Control
                {...registerIngrediant("ingredientUnit")}
                type='txt'
                placeholder='Enter ingredient unit'
              />
              <div style={{ color: "red" }}>
                {errorsIngrediants.ingredientUnit?.message ? (
                  errorsIngrediants.ingredientUnit?.message
                ) : (
                  <>&nbsp;</>
                )}
              </div>
            </div>

            <div style={{ marginRight: 10, display: "flex", flexDirection: "column" }}>
              <Form.Control
                {...registerIngrediant("ingredientAmount")}
                type='number'
                step='0.01'
                placeholder='Enter ingredient amount'
              />

              <div style={{ color: "red" }}>
                {errorsIngrediants.ingredientAmount?.message ? (
                  errorsIngrediants.ingredientAmount?.message
                ) : (
                  <>&nbsp;</>
                )}
              </div>
            </div>

            <div style={{ display: "flex", flexDirection: "column" }}>
              <Button type='submit' variant='primary'>
                add ingredient
              </Button>
              <>&nbsp;</>
            </div>
          </div>
        </Form.Group>

        {isSubmitted && data.length == 0 && (
          <div style={{ color: "red" }}>Please add one ingredient at least</div>
        )}
      </Form>

      {data.length > 0 && (
        <Table data={data} shouldUpdateScroll={false}>
          <Column width={200}>
            <HeaderCell>Name</HeaderCell>
            <EditCell
              Input={(props) => <Form.Control type='text' {...props} />}
              dataKey='name'
              onChange={handleChange}
            />
          </Column>
          <Column width={200}>
            <HeaderCell>Unit</HeaderCell>
            <EditCell
              Input={(props) => <Form.Control type='text' {...props} />}
              dataKey='unit'
              onChange={handleChange}
            />
          </Column>

          <Column width={300}>
            <HeaderCell>Amount</HeaderCell>
            <EditCell
              Input={(props) => <Form.Control type='number' {...props} />}
              dataKey='amount'
              onChange={handleChange}
            />
          </Column>

          <Column flexGrow={1}>
            <HeaderCell>Action</HeaderCell>
            <ActionCell dataKey='id' onClick={handleEditState} onDelete={handleDelete} />
          </Column>
        </Table>
      )}

      <Button
        variant='primary'
        onClick={() => {
          if (formRef.current) {
            console.log({ form: formRef.current });
            formRef.current?.dispatchEvent(
              new Event("submit", { cancelable: true, bubbles: true }),
            );
          }
        }}
      >
        Save Changes
      </Button>

      <Button variant='danger' onClick={deleteRecipe}>
        Delete recipe
      </Button>
    </div>
  );
}
