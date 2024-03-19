import TextField from "@mui/material/TextField";
import Chip from "@mui/material/Chip";

import Autocomplete from "@mui/material/Autocomplete";
import Button from "@mui/material/Button";
import MultiSelect from "../../components/multiselect/Multiselect";

import Modal from "../../components/modal/Modal";
import JuiceFormModal from "../../components/juiceFormModal/JuiceFormModal";

import { KoktelComponent } from "../../components/koktel/KoktelCompoment";

import { useEffect, useState } from "react";

import styles from "./MainPage.module.css";

export const MainPage = (props) => {
  const [data, setData] = useState(null);

  const [searchField, setSearchField] = useState("");

  const [categoriesArr, setCategoriesArr] = useState([]);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [selectedIngredients, setSelectedIngredients] = useState([]);

  const [totalPages, setTotalPages] = useState(0);
  const [currentPage, setCurrentPage] = useState(0);

  const [koktelDetails, setKoktelDetails] = useState(null);

  const [isModalopen, setModalOpen] = useState(false);
  const [isJuiceModalOpen, setJuiceModalOpen] = useState(false);

  const [inputValue, setInputValue] = useState("");

  useEffect(() => {
    filterData();
    prepareCategories();
  }, []);

  useEffect(() => {
    filterData();
  }, [currentPage]);

  async function fetchDetails(idKoktela) {
    const apiKey = process.env.REACT_APP_API_KEY;
    const url = `http://localhost:8080/api/koktel/${idKoktela}`;
    const headers = {
      api_key: apiKey,
    };

    try {
      const response = await fetch(url, {
        headers: headers,
      });

      if (!response.ok) {
        throw new Error("Failed to fetch data");
      }

      const details = await response.json();

      setKoktelDetails(details);
    } catch (error) {
      console.error("Error fetching data:", error.message);
    }
  }

  const prepareCategories = async () => {

    const postData = async () => {
      const url = "http://localhost:8080/api/kategorija-list";
      try {
        const response = await fetch(url, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            api_key: process.env.REACT_APP_API_KEY,
          },
        });

        if (!response.ok) {
          const errorText = await response.text();
          const errorMessage = JSON.parse(errorText).join("\n");
          alert(errorMessage);
          throw new Error("There is a problem with the response");
        }

        const responseData = await response.json();
        return responseData;
      } catch (error) {
        console.error("Error:", error);
        throw error;
      }
    };

    try {
      const responseData = await postData();
      setCategoriesArr(responseData.map(item => item.nazivKategorije));      

    } catch (error) {
      console.error("There is an error!");
    }

  };

  const filterData = async () => {
    const postData = async () => {
      const url = "http://localhost:8080/api/koktels-filtered";
      const data = {
        search: searchField,
        kategorije: selectedCategories,
        sastojci: selectedIngredients,
        offset: currentPage,
        pageSize: 8,
      };

      try {
        const response = await fetch(url, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            api_key: process.env.REACT_APP_API_KEY,
          },
          body: JSON.stringify(data),
        });

        if (!response.ok) {
          const errorText = await response.text();
          const errorMessage = JSON.parse(errorText).join("\n");
          alert(errorMessage);
          throw new Error("There is a problem with the response");
        }

        const responseData = await response.json();
        return responseData;
      } catch (error) {
        console.error("Error:", error);
        throw error;
      }
    };

    try {
      const responseData = await postData();
      if (responseData.koktelsListResponses.length === 0) {
        if (currentPage !== 0) {
          setCurrentPage((currentPage) => currentPage - 1);
        }
        alert("There are no more data!");
      } else {
        setData(responseData.koktelsListResponses);
      }
    } catch (error) {
      console.error("There is an error!");
    }
  };

  const filterHandler = () => {
    filterData();
  };

  const modalHandler = (idKoktela) => {
    setModalOpen(true);
    fetchDetails(idKoktela);
  };

  const addJuiceHandler = () => {
    setJuiceModalOpen(true);
  };

  const handleInputChange = (event) => {
    setInputValue(event.target.value);
  };

  const handleKeyDown = (event) => {
    if (
      event.key === "Enter" &&
      inputValue.trim() !== "" &&
      !selectedIngredients.includes(inputValue.trim())
    ) {
      setSelectedIngredients((chips) => [...chips, inputValue.trim()]);
      setInputValue("");
    }
  };

  const handleChipDelete = (chipToDelete) => () => {
    setSelectedIngredients((chips) =>
      chips.filter((chip) => chip !== chipToDelete)
    );
  };

  const previousPageHandler = () => {
    setCurrentPage((currentPage) => currentPage - 1);
  };

  const nextPageHandler = () => {
    setCurrentPage((currentPage) => currentPage + 1);
  };

  return (
    <>
      {!data && (
        <div
          style={{ fontSize: "40px", textAlign: "center", marginTop: "300px" }}
        >
          Loading data...
        </div>
      )}
      {data && (
        <>
          <h1
            style={{
              marginLeft: "20px",
              marginTop: "20px",
              marginBottom: "-20px",
              fontSize: "35px",
              color: "darkblue",
            }}
          >
            Juice maker application
          </h1>
          <h4 style={{ marginLeft: "20px" }}>
            FONtazija Kokteli is an application that allows users to access
            various recipes for cocktails and also enables them to add their own
            recipes to the collection.
          </h4>

          <div className={styles["upper-box"]}>
            <div className={styles["search-box"]}>
              <TextField
                onChange={(event) => {
                  setSearchField(event.target.value);
                }}
                sx={{ width: 1040 }}
                id="outlined-basic"
                label="Search"
                variant="outlined"
              />
            </div>

            <div className={styles["button-box"]}>
              <Button
                variant="contained"
                onClick={filterHandler}
                sx={{ width: 300, height: 50 }}
              >
                Filter
              </Button>
            </div>

            <div className={styles["filter-buttons"]}>
              <div className={styles["category-box"]}>
                <MultiSelect
                  label={"Choose Categories"}
                  options={categoriesArr}
                  setField={setSelectedCategories}
                >
                  Category
                </MultiSelect>
              </div>

              <div className={styles["ingredients-box"]}>
                <TextField
                  style={{ width: "700px" }} // Adjust the width as needed
                  label={"Insert Ingredients (press enter to add)"}
                  value={inputValue}
                  onChange={handleInputChange}
                  onKeyDown={handleKeyDown}
                />
              </div>
              {selectedIngredients.map((ingredient) => (
                <Chip
                  style={{ marginTop: "20px" }}
                  key={ingredient}
                  label={ingredient}
                  onDelete={handleChipDelete(ingredient)}
                  color="primary"
                  variant="outlined"
                />
              ))}
            </div>

            <div className={styles["koktels-box"]}>
              {data.map((item, index) => (
                <KoktelComponent
                  key={index}
                  data={item}
                  modalHandler={modalHandler}
                />
              ))}
            </div>
          </div>
          <div className={styles["add-box"]}>
            <Button
              variant="contained"
              sx={{ width: 400, height: 50 }}
              onClick={addJuiceHandler}
            >
              Add Juice
            </Button>
            <Button
              variant="contained"
              sx={{ width: 300, height: 30, alignSelf: "center" }}
              onClick={previousPageHandler}
              disabled={currentPage === 0}
            >
              Previous page
            </Button>
            <Button
              variant="contained"
              sx={{ width: 300, height: 30, alignSelf: "center" }}
              onClick={nextPageHandler}
            >
              Next page
            </Button>
          </div>
          {isModalopen && (
            <Modal onClose={() => setModalOpen(false)}>
              {!koktelDetails && (
                <div
                  style={{
                    fontSize: "40px",
                    textAlign: "center",
                    marginTop: "300px",
                  }}
                >
                  Loading data...
                </div>
              )}
              {koktelDetails && (
                <>
                  <h2>{koktelDetails.naziv}</h2>
                  <p>
                    <strong>Description:</strong> {koktelDetails.opis}
                  </p>
                  <p>
                    <strong>Preparation Method:</strong>{" "}
                    {koktelDetails.nacinPripreme}
                  </p>
                  <p>
                    <strong>Ingredients:</strong>
                  </p>
                  <ul>
                    {koktelDetails.sastojci.map((ingredient, index) => (
                      <li key={index}>
                        {ingredient[0]} - {ingredient[1]} {ingredient[2]}
                      </li>
                    ))}
                  </ul>
                </>
              )}
            </Modal>
          )}
          {isJuiceModalOpen && (
            <Modal onClose={() => setJuiceModalOpen(false)}>
              <JuiceFormModal
                filterData={filterData}
                setJuiceModalOpen={setJuiceModalOpen}
              />
            </Modal>
          )}
        </>
      )}
    </>
  );
};
