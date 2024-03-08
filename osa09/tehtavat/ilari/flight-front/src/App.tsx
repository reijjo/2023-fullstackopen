import { ChangeEvent, SyntheticEvent, useEffect, useState } from "react";

import { DiaryEntry, NewDiaryEntry, Visibility, Weather } from "./types";
import { createDiary, getAllDiaries } from "./flightService";
import { isAxiosError } from "axios";

const App = () => {
  const [flights, setFlights] = useState<DiaryEntry[]>([]);
  const [newFlight, setNewFlight] = useState<NewDiaryEntry>({
    date: "",
    weather: Weather.Empty,
    visibility: Visibility.Empty,
    comment: "",
  });
  const [message, setMessage] = useState<string | null>(null);

  useEffect(() => {
    getAllDiaries().then((data) => {
      setFlights(data);
    });
  }, []);

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;

    setNewFlight((prev) => ({ ...prev, [name]: value }));
  };

  const flightCreation = async (event: SyntheticEvent) => {
    event.preventDefault();

    const flightToAdd = {
      id: flights.length + 1,
      ...newFlight,
    };

    try {
      const res = await createDiary(flightToAdd);
      setFlights(flights.concat(res));
    } catch (error: unknown) {
      if (isAxiosError(error)) {
        console.error(error.response?.data);
        setMessage(error.response?.data);
        setTimeout(() => {
          setMessage(null);
        }, 5000);
      } else {
        console.log("ei axios error", error);
      }
    }

    setNewFlight({
      date: "",
      weather: Weather.Empty,
      visibility: Visibility.Empty,
      comment: "",
    });
  };

  return (
    <>
      {/* Add flight */}
      <div>
        <h2>Add new entry</h2>
        {message && <p style={{ color: "red" }}>{message}</p>}
        <form onSubmit={flightCreation}>
          <div>
            date{" "}
            <input
              value={newFlight.date}
              type="text"
              name="date"
              onChange={handleChange}
            />
          </div>
          <div>
            visibility{" "}
            <input
              value={newFlight.visibility}
              type="text"
              name="visibility"
              onChange={handleChange}
            />
          </div>
          <div>
            weather{" "}
            <input
              value={newFlight.weather}
              type="text"
              name="weather"
              onChange={handleChange}
            />
          </div>
          <div>
            comment{" "}
            <input
              value={newFlight.comment}
              type="text"
              name="comment"
              onChange={handleChange}
            />
          </div>
          <button type="submit">Add</button>
        </form>
      </div>

      {/* Diaries */}
      <div>
        <h2>Diary entries</h2>
        {flights.map((f) => (
          <div key={f.id}>
            <h3>{f.date}</h3>
            <div>visibility: {f.visibility}</div>
            <div>weather: {f.weather}</div>
            <div>
              <i>{f.comment}</i>
            </div>
          </div>
        ))}
      </div>
    </>
  );
};

export default App;
