import {useQuery} from "react-query";
import {IGetMoviesResult, getMovies} from "../api";
import styled from "styled-components";
import {makeImagePath} from "../utils";
import {
  AnimatePresence,
  motion,
  useScroll,
  useViewportScroll,
} from "framer-motion";
import {useState} from "react";
import {useHistory, useRouteMatch} from "react-router-dom";
import {theme} from "../theme";

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
  cursor: pointer;
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

const Info = styled(motion.div)`
  padding: 20px;
  background-color: ${(props) => props.theme.black.lighter};
  opacity: 0;
  position: absolute;
  width: 100%;
  bottom: 0;
  h4 {
    text-align: center;
    font-size: 18px;
  }
`;

const InfoVariants = {
  hover: {
    opacity: 1,
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

//영화를 눌렀을때 배경이 어두워지도록
const Overlay = styled(motion.div)`
  position: fixed;
  top: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  opacity: 0;
`;

const BigMovie = styled(motion.div)`
  position: absolute;
  width: 40vw;
  height: 80vh;
  left: 0;
  right: 0;
  margin: 0 auto;
  background-color: ${(props) => props.theme.black.lighter};
  border-radius: 15px;
  overflow: hidden;
`;

const BigCover = styled.div`
  width: 100%;
  background-size: cover;
  background-position: center center;
  height: 400px;
`;

const BigTitle = styled.h3`
  color: ${(props) => props.theme.white.lighter};
  padding: 20px;
  font-size: 46px;
  position: relative;
  top: -80px;
`;

const BigOverview = styled.p`
  padding: 20px;
  position: relative;
  top: -80px;
  color: ${(props) => props.theme.white.lighter};
`;

const offset = 6;

function Home() {
  //url을 바꾸기위해 사용 useHistory
  const history = useHistory();
  //현재 url이 prop과 일치하는지 파악하기 위해 match 사용
  const bigMovieMatch = useRouteMatch<{movieId: string}>("/movies/:movieId");
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

  const onBoxClicked = (movieId: number) => {
    //클릭시 아래 url로 이동
    history.push(`/movies/${movieId}`);
  };

  // scroll한 위치에 상관없이 모달이 가운데 나오게하기위함
  const {scrollY} = useScroll();

  //overlay를 눌렀을 경우 다시 /링크로 돌아가게
  const onOverlayClick = () => history.push("/");

  //click한 영화의 아이디와 매치하여 이미지를 불러오기 위함
  const clickedMovie =
    bigMovieMatch?.params.movieId &&
    data?.results.find(
      (movie) => movie.id + "" === bigMovieMatch.params.movieId
    );

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
                      layoutId={movie.id + ""}
                      key={movie.id}
                      //마우스를 대는 경우
                      whileHover="hover"
                      initial="normal"
                      variants={boxVariants}
                      onClick={() => onBoxClicked(movie.id)}
                      //애니메이션의 튕김을 방지 tween | default값은 spring
                      transition={{type: "tween"}}
                      bgPhoto={makeImagePath(movie.backdrop_path, "w500")}
                    >
                      {/* Info는 Box의 자식이기에 자동으로 whileHover같은 스타일이 상속됨 따라서 자신만의 variants를 만들어야함! */}
                      <Info variants={InfoVariants}>
                        <h4>{movie.title}</h4>
                      </Info>
                    </Box>
                  ))}
              </Row>
            </AnimatePresence>
          </Slider>
          <AnimatePresence>
            {bigMovieMatch ? (
              <>
                <Overlay
                  onClick={onOverlayClick}
                  exit={{opacity: 0}}
                  animate={{opacity: 1}}
                />
                <BigMovie
                  // 스크롤 위치 상관없이 모달을 정위치 시키기 위함
                  style={{top: scrollY.get() + 100}}
                  layoutId={bigMovieMatch.params.movieId}
                >
                  {clickedMovie && (
                    <>
                      <BigCover
                        style={{
                          backgroundImage: `linear-gradient(to top, black, transparent), url(${makeImagePath(
                            clickedMovie.backdrop_path,
                            "w500"
                          )})`,
                        }}
                      />
                      <BigTitle>{clickedMovie.title}</BigTitle>
                      <BigOverview>{clickedMovie.overview}</BigOverview>
                    </>
                  )}
                </BigMovie>
              </>
            ) : null}
          </AnimatePresence>
        </>
      )}
    </Wrapper>
  );
}
export default Home;

//done!
