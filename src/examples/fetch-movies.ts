// Network 패널 확인용 임시 예제예요. src/main.tsx에 import "./examples/fetch-movies"; 를 잠시 추가해서 실행하고,
// 확인이 끝나면 import를 지워 주세요.
import { getMoviesWithFetch } from "../api/movies/get-movies-with-fetch";

getMoviesWithFetch(1)
  .then((response) => console.log(response.results))
  .catch((error) => console.error(error));
