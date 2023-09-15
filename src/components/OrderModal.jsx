import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./styles/OrderModal.module.css";

function OrderModal({ order, setOrderModal }) {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [nameIsValid, setNameIsValid] = useState(true);
  const [phoneIsValid, setPhoneIsValid] = useState(true);
  const [addressIsValid, setAddressIsValid] = useState(true);

  const validateForm = function () {
    const phoneCheck = /^[ ()-]*([0-9][ ()-]*){10}$/;
    let phoneValid = false;

    if (phone.match(phoneCheck)) {
      const digits = phone.replace(/\D/g, "");
      const formattedPhone = `(${digits.slice(0, 3)}) ${digits.slice(
        3,
        6
      )}-${digits.slice(6)}`;
      setPhone(formattedPhone);
      phoneValid = true;
    }

    setNameIsValid(!!name);
    setPhoneIsValid(phoneValid);
    setAddressIsValid(!!address);

    return !!name && phoneValid && !!address;
  };

  const placeOrder = async () => {
    if (!validateForm()) {
      return;
    }

    const response = await fetch("/api/orders", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        name,
        phone,
        address,
        items: order
      })
    });
    const data = await response.json();

    if (response.status === 200) {
      navigate(`/order-confirmation/${data.id}`);
    }
  };

  return (
    <>
      <div
        label="Close"
        className={styles.orderModal}
        onKeyPress={(e) => {
          if (e.key === "Escape") {
            setOrderModal(false);
          }
        }}
        onClick={() => setOrderModal(false)}
        role="menuitem"
        tabIndex={0}
      />
      <div className={styles.orderModalContent}>
        <h2>Place Order</h2>
        <form className={styles.form}>
          <div className={styles.formGroup}>
            <label htmlFor="name">
              Name
              <input
                onChange={(e) => {
                  e.preventDefault();
                  setName(e.target.value);
                }}
                type="text"
                id="name"
              />
            </label>
          </div>
          <div className={styles.formGroup}>
            <label htmlFor="phone">
              Phone
              <input
                onChange={(e) => {
                  e.preventDefault();
                  setPhone(e.target.value);
                }}
                type="phone"
                id="phone"
              />
            </label>
          </div>
          <div className={styles.formGroup}>
            <label htmlFor="address">
              Address
              <input
                onChange={(e) => {
                  e.preventDefault();
                  setAddress(e.target.value);
                }}
                type="phone"
                id="address"
              />
            </label>
          </div>
        </form>

        <div className={styles.errorMessageBox}>
          {!nameIsValid && <p>Please enter a name</p>}
          {!phoneIsValid && <p>Please enter a valid phone number</p>}
          {!addressIsValid && <p>Please enter an address</p>}
        </div>

        <div className={styles.orderModalButtons}>
          <button
            className={styles.orderModalClose}
            onClick={() => setOrderModal(false)}
          >
            Close
          </button>
          <button
            onClick={() => {
              placeOrder();
            }}
            className={styles.orderModalPlaceOrder}
          >
            Place Order
          </button>
        </div>
      </div>
    </>
  );
}

export default OrderModal;
