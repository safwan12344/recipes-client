import { useSnapshot } from "valtio";
import "./App.css";
import BookList from "./components/books/BookList";
import Categories from "./components/categories/Categories";
import SearchRecipiesResault from "./components/search/SearchRecipiesResault";
import searchState from "./states/search";
import Loading from "./assets/loading";
import WeeklyActivities from "./components/activities/WeeklyActivities";

function App() {
  const searchSnap = useSnapshot(searchState);
  return (
    <div className='App'>
      <div className='left-side'>
        <div className='left-main'>
          <BookList />
          {searchSnap.search && searchSnap.isLoading && <Loading />}
          {searchSnap.search && !searchSnap.isLoading && (
            <>
              {searchSnap.results.length === 0 && (
                <h1>No result were found for {searchSnap.search}</h1>
              )}
              {searchSnap.results.length > 0 && <h1>Result were found for {searchSnap.search}</h1>}
              <SearchRecipiesResault />
            </>
          )}
          {!searchSnap.search && <Categories />}
        </div>
      </div>
      <div className='right-side'>
        <WeeklyActivities />
      </div>
    </div>
  );
}

export default App;
