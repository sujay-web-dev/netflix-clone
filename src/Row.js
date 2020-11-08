import React, { useState, useEffect } from "react";
import axios from "./axios";
import "./row.css";
import YouTube from "react-youtube";
import movieTrailer from "movie-trailer";

const base_url = "https://image.tmdb.org/t/p/original/";

function Row({ title, fetchUrl, isLargeRow }) {
  const [moives, setmoives] = useState([]);
  const [trailerUrl, setTrailerUrl] = useState([false]);

  useEffect(() => {
    async function fetchData() {
      const request = await axios.get(fetchUrl);
      request.data.results = request.data.results.filter(element => element.backdrop_path !== null);
    //   console.log(request.data.results);
      setmoives(request.data.results);
      return request;
    }
    fetchData();
  }, [fetchUrl]);

  const opts= {
      height: "390",
      width: "100%",
      playerVars: {
          autoplay: 1,
      },
  };


  const handleClick = (movie) => {
      if (trailerUrl){
          setTrailerUrl("");
      } else {
          movieTrailer(movie?.name || "")
          .then((url) => {
              if(url[0]) {
            const urlParams = new URLSearchParams(new URL(url).search);
            setTrailerUrl(urlParams.get("v"));
          }else{
              setTrailerUrl(false);
          }
        })
          .catch((error) => console.log(error));
      }
  }
//   console.log(moives);

  return (
    <div className="row">
      <h2>{title}</h2>

      <div className="row__posters">
        {/* posters */}

        {moives.map((movie) => (
          <img
            key={movie.id}
            onClick={() => handleClick(movie)}
            className={`row__poster ${isLargeRow && "row_posterLarge"}`}
            src={`${base_url}${
              isLargeRow ? movie.poster_path : movie.backdrop_path
            }`}
            alt={movie.name}
          />
        ))}
      </div>
      {trailerUrl[0] && <YouTube videoId={trailerUrl} opts={opts} />}
    </div>
  );
}

export default Row;
