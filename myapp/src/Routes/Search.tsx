import {useLocation} from "react-router-dom";

function Search() {
  const location = useLocation();

  //키워드가 여러개 있으면 직접 파싱하는 것이 어렵기 때문에 URLSearchParams 사용
  // URLSearchParams 은 자바스크립트 기능 -> url이 아무리 길고 복잡해져도 원하는 값을 손쉽게 얻을 수 있다.
  const keyword = new URLSearchParams(location.search).get("keyword");
  console.log(keyword);
  return null;
}

export default Search;
