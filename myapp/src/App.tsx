import {BrowserRouter as Router, Switch, Route} from "react-router-dom";
import Home from "./Routes/Home"; // 예시: Home 컴포넌트의 파일 경로에 따라 변경되어야 함
import Tv from "./Routes/Tv"; // 예시: Tv 컴포넌트의 파일 경로에 따라 변경되어야 함
import Search from "./Routes/Search"; // 예시: Search 컴포넌트의 파일 경로에 따라 변경되어야 함
import Header from "./Components/Header";
function App() {
  return (
    <Router>
      <Header />
      <Switch>
        <Route path="/tv">
          <Tv />
        </Route>
        <Route path="/search">
          <Search />
        </Route>
        {/* 맨 처음경로를 마지막에 두어야함 */}
        <Route path="/">
          <Home />
        </Route>
      </Switch>
    </Router>
  );
}

export default App;
