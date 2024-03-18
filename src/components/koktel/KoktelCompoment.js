import styles from "./Koktel.module.css";
import image from "../../media/mojito_koktel-scaled.jpg";
import * as React from "react";
import Button from "@mui/material/Button";
import { styled } from "@mui/material/styles";
import Dialog from "@mui/material/Dialog";

import Modal from "../modal/Modal";
import { useState } from "react";

export const KoktelComponent = (props) => {

  return (
    <>
      <div className={styles["juice-box"]} onClick={() => props.modalHandler(props.data?.idKoktela)}>
        <div className={styles["image-box"]}>
          <img
            key="1"
            src={`data:image/png;base64,${props.data?.slikaCase}`}
            alt={props.data?.nazivCase}
            width="300"
            height="300"
          />
        </div>
        <div className={styles["description-box"]}>
          <b>{props.data?.nazivKoktela}</b>
        </div>
        <div className={styles["description-box-naziv"]}>
          {props.data?.nazivKategorije}
        </div>
      </div>
    </>
  );
};
