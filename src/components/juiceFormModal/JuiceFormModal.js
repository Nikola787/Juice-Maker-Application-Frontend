import React, { useState } from "react";
import Modal from "../modal/Modal";

import styles from "../juiceFormModal/JuiceFormModal.module.css";

const JuiceFormModal = (props) => {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [recipe, setRecipe] = useState("");
  const [glassName, setGlassName] = useState("");
  const [image, setImage] = useState();
  const [category, setCategory] = useState("");
  const [ingredients, setIngredients] = useState([]);

  const handleIngredientChange = (index, field, value) => {
    const updatedIngredients = [...ingredients];
    updatedIngredients[index] = {
      ...updatedIngredients[index],
      [field]: value,
    };
    setIngredients(updatedIngredients);
  };

  const handleAddIngredient = () => {
    setIngredients([...ingredients, { name: "", quantity: "", unit: "" }]);
  };

  const getBase64 = (file) => {
    return new Promise((resolve, reject) => {
      let reader = new FileReader();
      reader.onload = function () {
        resolve(reader.result);
      };
      reader.onerror = function (error) {
        reject(error);
      };
      reader.readAsDataURL(file);
    });
  };

  const handleCocktailCreation = async () => {
    try {
      const apiKey = process.env.REACT_APP_API_KEY;
      const url = "http://localhost:8080/api/add/new-koktel";

      const file = image;

      if (!file) {
        alert("No image selected");
        return;
      }
      const base64image = await getBase64(file);

      if (!base64image) {
        console.error("Failed to convert image to base64");
        return;
      }

      let base64String = base64image;

      const requestBody = {
        base64Image: base64String,
        koktel: {
          naziv: name,
          opis: description,
          nacinPripreme: recipe,
          casa: {
            naziv: glassName,
            slika: "",
          },
          kategorija: {
            id: "",
            nazivKategorije: category,
          },
        },
        sastojci: ingredients.map((ingredient) => ({
          naziv: ingredient.name,
        })),
        koktelSastojaks: ingredients.map((ingredient, index) => ({
          kolicina: ingredient.quantity,
          mernaJedinica: ingredient.unit,
        })),
      };

      try {
        const response = await fetch(url, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            api_key: apiKey,
          },
          body: JSON.stringify(requestBody),
        });

        if (!response.ok) {
          const errorText = await response.text();
          const errorMessage = JSON.parse(errorText).join("\n");
          alert(errorMessage);
          throw new Error("Failed ");
        }

        props.filterData();
        props.setJuiceModalOpen(false);

      } catch (error) {
        console.error("Error adding new cocktail: " + error.message);
      }
    } catch (error) {
      console.error("Error handling cocktail creation: " + error.message);
    }
  };

  return (
    <div className={styles["main-box"]}>
      <h2>Add New Cocktail</h2>
      <div className={styles["main-box"]}>
        <label>Cocktail name:</label>
        <input
          type="text"
          required
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

        <label>Cocktail description:</label>
        <textarea
          type="text"
          required
          rows="3"
          style={{ overflowY: "auto", resize: "none" }}
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />

        <label>Cocktail recipe:</label>
        <textarea
          type="text"
          required
          rows="3"
          style={{ overflowY: "auto", resize: "none" }}
          value={recipe}
          onChange={(e) => setRecipe(e.target.value)}
        />

        <label>Glass name in which cocktail is served:</label>
        <input
          type="text"
          required
          value={glassName}
          onChange={(e) => setGlassName(e.target.value)}
        />

        <label>Cocktail image:</label>
        <input
          type="file"
          accept="image/*"
          required
          onChange={(e) => setImage(e.target.files[0])}
        />

        <label>Cocktail category (Sladak, Polusladak or Kiseo):</label>
        <input
          type="text"
          required
          value={category}
          onChange={(e) => setCategory(e.target.value)}
        />

        <div className={styles["ingredients-box"]}>
          {ingredients.map((ingredient, index) => (
            <div key={index} className={styles["ingredients-form-part"]}>
              <input
                style={{ width: "50%" }}
                type="text"
                value={ingredient.name}
                placeholder="Ingredient name"
                onChange={(e) =>
                  handleIngredientChange(index, "name", e.target.value)
                }
              />
              <input
                style={{ width: "30%" }}
                type="text"
                value={ingredient.quantity}
                placeholder="Quantity"
                onChange={(e) =>
                  handleIngredientChange(index, "quantity", e.target.value)
                }
              />
              <input
                style={{ width: "20%" }}
                type="text"
                value={ingredient.unit}
                placeholder="Unit"
                onChange={(e) =>
                  handleIngredientChange(index, "unit", e.target.value)
                }
              />
            </div>
          ))}
          <button onClick={handleAddIngredient}>Add Ingredients</button>
        </div>

        <button style={{ marginTop: "30px" }} onClick={handleCocktailCreation}>
          Create new Cocktail
        </button>
      </div>
    </div>
  );
};

export default JuiceFormModal;
