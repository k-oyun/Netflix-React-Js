import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import Home from "./Routes/Home"; // 예시: Home 컴포넌트의 파일 경로에 따라 변경되어야 함
import Tv from "./Routes//Tv"; // 예시: Tv 컴포넌트의 파일 경로에 따라 변경되어야 함
import Search from "./Routes//Search"; // 예시: Search 컴포넌트의 파일 경로에 따라 변경되어야 함
import Header from "./Routes/Components/Header";
function App() {
  return (
    <Router>
      <Header />
      <Switch>
        <Route path="/">
          <Home />
        </Route>
        <Route path="/tv">
          <Tv />
        </Route>
        <Route path="/search">
          <Search />
        </Route>
      </Switch>
    </Router>
  );
}

export default App;
