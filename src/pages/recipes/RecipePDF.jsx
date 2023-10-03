import PropTypes from "prop-types";
import { Document, Page, Text, View, Image, StyleSheet, Font } from "@react-pdf/renderer";
// import RobotoBlack from "../../assets/fonts/Roboto-Black.ttf"
import RobotoBold from "../../assets/fonts/Roboto-Bold.ttf";
import RobotoLight from "../../assets/fonts/Roboto-Light.ttf";

Font.register({
  family: "Roboto",
  fonts: [
    {
      src: RobotoLight,
    },
    {
      src: RobotoLight,
      fontWeight: "normal",
    },
    {
      src: RobotoBold,
      fontWeight: "bold",
    },
  ],
});

const styles = StyleSheet.create({
  page: {
    display: "flex",
    flexDirection: "column",
    backgroundColor: "#fff",
    fontFamily: "Roboto",
    fontWeight: "normal",
  },
  section: {
    margin: 10,
    padding: 10,
  },
  image: {
    height: 250,
  },
  ingredients: {
    padding: "0 10px",
  },
  ingredient: {
    display: "flex",
    alignItems: "center",
    flexDirection: "row",
  },
  dot: {
    width: 5,
    height: 5,
    borderRadius: "50%",
    backgroundColor: "blue",
    marginRight: 5,
  },
  preparation: {
    marginBottom: 10,
  },
  step: {
    color: "black",
    fontFamily: "Roboto",
    fontWeight: "bold",
  },
});

function RecipePDF({ recipe, base64 }) {
  return (
    <Document style={{ width: 400, height: 400 }}>
      <Page size='A4' style={styles.page}>
        <View style={styles.section}>
          <Text>{recipe.name}</Text>
        </View>
        <View style={styles.section}>
          <Text>{recipe.description}</Text>
        </View>
        <View style={[styles.section, styles.image]}>
          <Image src={base64} />
        </View>
        <View style={styles.section}>
          <Text>Ingredients:</Text>
          <View style={styles.ingredients}>
            {recipe.ingredients.map((item) => {
              return (
                <View style={styles.ingredient} key={item._id}>
                  <View style={styles.dot} />
                  <Text>{`${item.name} ${item.unit} ${item.amount}`}</Text>
                </View>
              );
            })}
          </View>
        </View>
      </Page>
      <Page>
        <View style={styles.section}>
          <Text>Preparation:</Text>
          <View style={styles.preparations}>
            {recipe.preparation.map((item, index) => {
              return (
                <View style={styles.preparation} key={item}>
                  <Text style={styles.step}>{`Step ${index + 1}`}</Text>
                  <Text>{item}</Text>
                </View>
              );
            })}
          </View>
        </View>
      </Page>
    </Document>
  );
}

RecipePDF.propTypes = {
  recipe: PropTypes.object.isRequired,
  base64: PropTypes.string.isRequired,
};

export default RecipePDF;
