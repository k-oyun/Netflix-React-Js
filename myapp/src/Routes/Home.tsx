import {useQuery} from "react-query";
import {IGetMoviesResult, getMovies} from "../api";
import styled from "styled-components";
import {makeImagePath} from "../utils";
import {AnimatePresence, motion} from "framer-motion";
import {useState} from "react";

const Wrapper = styled.div`
  background-color: black;
  padding-bottom: 200px;
`;

const Loader = styled.div`
  height: 20vh;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const Banner = styled.div<{bgPhoto: string}>`
  height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding: 60px;
  background-image: linear-gradient(rgba(0, 0, 0, 0), rgba(0, 0, 0, 1)),
    url(${(props) => props.bgPhoto});
  background-size: cover;
`;

const Title = styled.h2`
  font-size: 68px;
  margin-bottom: 20px;
`;
const Overview = styled.p`
  font-size: 30px;
  width: 50%;
`;

const Slider = styled.div`
  position: relative;
  top: -100px;
`;

const Row = styled(motion.div)`
  display: grid;
  gap: 5px;
  grid-template-columns: repeat(6, 1fr);
  position: absolute;
  width: 100%;
`;

//motion div라는 prop이 있기때문에 다른 방식으로 prop 지정
const Box = styled(motion.div)<{bgPhoto: string}>`
  background-color: white;
  background-image: url(${(props) => props.bgPhoto});
  background-size: cover;
  background-position: center center;
  height: 200px;
  font-size: 66px;

  //맨처음과 마지막 영화의 scale이 커지면서 이미지가 잘림
  //transform origin을 사용하여 이미지가 커지면 안되는 방향을 지정 ex)left, right
  &:first-child {
    transform-origin: center left;
  }
  &:last-child {
    transform-origin: center right;
  }
`;

const boxVariants = {
  //평소 크기
  normal: {
    scale: 1,
  },

  //마우스를 올렸을때
  hover: {
    scale: 1.3,
    y: -50,
    transition: {
      delay: 0.3,
      duration: 0.3,
      type: "tween",
    },
  },
};

const rowVariants = {
  hidden: {
    x: window.outerWidth + 5,
  },
  visible: {
    x: 0,
  },
  exit: {
    x: -window.outerWidth - 5,
  },
};

const offset = 6;

function Home() {
  //fetch api for banner
  const {data, isLoading} = useQuery<IGetMoviesResult>(
    ["movies", "noewPlaying"],
    getMovies
  );
  const [index, setIndex] = useState(0);
  const [leaving, setLeaving] = useState(false);
  const increaseIndex = () => {
    if (data) {
      if (leaving) return;
      toggleLeaving();
      //이미 배너에 사용중인 영화가 있기에 -1
      const totalMovies = data.results.length - 1;
      const maxIndex = Math.floor(totalMovies / offset) - 1;
      //다음 영화를 위해 index+1
      //인덱스가 maxindex이면 0으로 되돌림 -> 그렇지 않으면 1증가
      setIndex((prev) => (prev === maxIndex ? 0 : prev + 1));
    }
  };
  const toggleLeaving = () => setLeaving((prev) => !prev);

  return (
    <Wrapper>
      {isLoading ? (
        <Loader>Loading...</Loader>
      ) : (
        <>
          <Banner
            onClick={increaseIndex}
            bgPhoto={makeImagePath(data?.results[0].backdrop_path || "")}
          >
            <Title>{data?.results[0].title}</Title>
            <Overview>{data?.results[0].overview}</Overview>
          </Banner>
          <Slider>
            {/* 컴포넌트가 렌더링되거나 파괴될 때 효과를 줄 수 있음  */}
            {/* onExitComplete는 exit이 끝났을때 실행됨 */}
            {/* initial={false}는 처음 시작시 initial을 적용시키지 않음 */}
            <AnimatePresence initial={false} onExitComplete={toggleLeaving}>
              <Row
                variants={rowVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                transition={{type: "tween", duration: 1}}
                //key에 따라 row가 생성됨 -> key가 바뀌면 위 애니메이션이 실행됨
                //따라서 모든 row를 렌더링할 필요가 없어짐
                key={index}
              >
                {/* pagenation사용 */}
                {/* 한개의 페이지에 6개씩 넣기 위함 -> 사전에 offset 지정*/}
                {data?.results
                  .slice(1)
                  .slice(offset * index, offset * index + offset)
                  .map((movie) => (
                    <Box
                      key={movie.id}
                      //마우스를 대는 경우
                      whileHover="hover"
                      initial="normal"
                      variants={boxVariants}
                      //애니메이션의 튕김을 방지 tween | default값은 spring
                      transition={{type: "tween"}}
                      bgPhoto={makeImagePath(movie.backdrop_path, "w500")}
                    />
                  ))}
              </Row>
            </AnimatePresence>
          </Slider>
        </>
      )}
    </Wrapper>
  );
}
export default Home;
