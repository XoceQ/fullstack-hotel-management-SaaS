'use client';

import { Dispatch, FC, SetStateAction, useState, useEffect } from "react";
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

type Props = {
  checkinDate: Date | null;
  setCheckinDate: Dispatch<SetStateAction<Date | null>>;
  checkoutDate: Date | null;
  setCheckoutDate: Dispatch<SetStateAction<Date | null>>;
  setAdults: Dispatch<SetStateAction<number>>;
  setNoOfChildren: Dispatch<SetStateAction<number>>;
  calcMinCheckoutDate: () => Date | null;
  price: number;          // Precio por noche (COP)
  discount: number;       // Descuento en %
  adults: number;
  noOfChildren: number;
  specialNote: string;
  isBooked: boolean;
  handleBookNowClick: () => void; // compatibilidad
};

const GOOGLE_FORM_URL =
  "https://docs.google.com/forms/d/e/1FAIpQLSc24b1y4AXHo_Y-eeEiWMC6o6iUz-caJHRIlVOmHM3HAMwGYQ/viewform?usp=header";

// Formateador COP
const formatCOP = (value: number) =>
  new Intl.NumberFormat('es-CO', {
    style: 'currency',
    currency: 'COP',
    maximumFractionDigits: 0,
  }).format(value);

const BookRoomCta: FC<Props> = (props) => {
  const {
    price,
    discount,
    specialNote,
    checkinDate,
    setCheckinDate,
    checkoutDate,
    setCheckoutDate,
    calcMinCheckoutDate,
    adults,
    setAdults,
    setNoOfChildren,
    noOfChildren,
    isBooked,
  } = props;

  const [showModal, setShowModal] = useState(false);
  const [errors, setErrors] = useState<{ checkin?: string; checkout?: string }>({});

  // Evitar scroll del body cuando el modal está abierto
  useEffect(() => {
    if (showModal) document.body.style.overflow = "hidden";
    else document.body.style.overflow = "";
    return () => { document.body.style.overflow = ""; };
  }, [showModal]);

  // Precio por noche con descuento (redondeado a pesos)
  const nightlyPrice = Math.round(price * (1 - (discount || 0) / 100));

  const calcNoOfDays = () => {
    if (!checkinDate || !checkoutDate) return 0;
    const timeDiff = checkoutDate.getTime() - checkinDate.getTime();
    return Math.ceil(timeDiff / (24 * 60 * 60 * 1000));
  };

  const nights = calcNoOfDays();
  const totalCOP = nights > 0 ? nightlyPrice * nights : 0;

  const handleConfirm = () => {
    setShowModal(false);
    // Abre en nueva pestaña (si prefieres misma pestaña: window.location.href = GOOGLE_FORM_URL)
    window.open(GOOGLE_FORM_URL, "_blank");
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const errs: { checkin?: string; checkout?: string } = {};
    if (!checkinDate) errs.checkin = "Selecciona la fecha de entrada";
    if (!checkoutDate) errs.checkout = "Selecciona la fecha de salida";
    setErrors(errs);
    if (Object.keys(errs).length === 0) setShowModal(true);
  };

  return (
    <form onSubmit={handleSubmit} noValidate className="px-7 py-6">
      <h3 className="leading-tight">
        <span className={`${discount ? 'text-gray-400 line-through' : ''} font-bold text-xl`}>
          {formatCOP(price)}
        </span>
        {discount ? (
          <span className="font-bold text-xl">
            {" "} | descuento {discount}% · Ahora{" "}
            <span className="text-tertiary-dark">{formatCOP(nightlyPrice)}</span> / noche
          </span>
        ) : (
          <span className="font-bold text-xl"> {" "} / noche</span>
        )}
      </h3>

      <div className="w-full border-b-2 border-b-secondary my-2" />
      <h4 className="my-8">{specialNote}</h4>

      <div className="flex">
        <div className="w-1/2 pr-2">
          <label htmlFor="check-in-date" className="block text-sm font-medium text-gray-900 dark:text-gray-400">
            Check In date
          </label>
          <DatePicker
            selected={checkinDate}
            onChange={(date: Date | null) => {
              setCheckinDate(date);
              if (date) setErrors(prev => ({ ...prev, checkin: undefined }));
            }}
            dateFormat="dd/MM/yyyy"
            minDate={new Date()}
            id="check-in-date"
            required
            aria-invalid={!!errors.checkin}
            aria-describedby={errors.checkin ? "checkin-error" : undefined}
            className={`w-full border text-black rounded-lg p-2.5 focus:ring-primary focus:border-primary ${
              errors.checkin ? "border-red-500" : "border-gray-300"
            }`}
          />
          {errors.checkin && (
            <p id="checkin-error" className="mt-1 text-xs text-red-600">
              {errors.checkin}
            </p>
          )}
        </div>

        <div className="w-1/2 pl-2">
          <label htmlFor="check-out-date" className="block text-sm font-medium text-gray-900 dark:text-gray-400">
            Check Out date
          </label>
          <DatePicker
            selected={checkoutDate}
            onChange={(date: Date | null) => {
              setCheckoutDate(date);
              if (date) setErrors(prev => ({ ...prev, checkout: undefined }));
            }}
            dateFormat="dd/MM/yyyy"
            disabled={!checkinDate}
            minDate={calcMinCheckoutDate() ?? undefined}
            id="check-out-date"
            required
            aria-invalid={!!errors.checkout}
            aria-describedby={errors.checkout ? "checkout-error" : undefined}
            className={`w-full border text-black rounded-lg p-2.5 focus:ring-primary focus:border-primary ${
              errors.checkout ? "border-red-500" : "border-gray-300"
            }`}
          />
          {errors.checkout && (
            <p id="checkout-error" className="mt-1 text-xs text-red-600">
              {errors.checkout}
            </p>
          )}
        </div>
      </div>

      <div className="flex mt-4">
        <div className="w-1/2 pr-2">
          <label htmlFor="adults" className="block text-sm font-medium text-gray-900 dark:text-gray-400">
            Adults
          </label>
          <input
            type="number"
            id="adults"
            value={adults}
            onChange={(e) => setAdults(+e.target.value)}
            min={1}
            max={5}
            className="w-full border text-black border-gray-300 rounded-lg p-2.5 focus:ring-primary focus:border-primary"
          />
        </div>
        <div className="w-1/2 pl-2">
          <label htmlFor="children" className="block text-sm font-medium text-gray-900 dark:text-gray-400">
            Children
          </label>
          <input
            type="number"
            id="children"
            value={noOfChildren}
            onChange={(e) => setNoOfChildren(+e.target.value)}
            min={0}
            max={3}
            className="w-full border text-black border-gray-300 rounded-lg p-2.5 focus:ring-primary focus:border-primary"
          />
        </div>
      </div>

      {nights > 0 && (
        <p className="mt-3">
          Total por {nights} noche(s): <strong>{formatCOP(totalCOP)}</strong>
        </p>
      )}

      <button
        type="submit"
        disabled={isBooked}
        className="btn-primary w-full mt-6 disabled:bg-gray-500 disabled:cursor-not-allowed"
      >
        {isBooked ? 'Booked' : 'Book Now'}
      </button>

      {/* Modal */}
      {showModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center"
          role="dialog"
          aria-modal="true"
        >
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/60"
            onClick={() => setShowModal(false)}
          />
          {/* Card */}
          <div className="relative z-10 w-full max-w-md mx-4 rounded-2xl bg-white text-gray-900 shadow-xl">
            <div className="p-6">
              <h2 className="text-lg font-semibold">Completar formulario</h2>
              <p className="mt-2 text-sm text-gray-600">
                Para finalizar tu reserva, debes llenar el formulario en una nueva pestaña.
              </p>

              <div className="mt-6 flex gap-3">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="w-1/2 rounded-xl border border-gray-300 px-4 py-2"
                >
                  Cancelar
                </button>
                <button
                  type="button"
                  onClick={handleConfirm}
                  className="w-1/2 btn-primary rounded-xl px-4 py-2"
                > Ir al formulario
                </button>
              </div>
            </div>

            {/* Cerrar */}
            <button
              aria-label="Cerrar"
              onClick={() => setShowModal(false)}
              className="absolute top-3 right-3 rounded-full p-1 text-gray-500 hover:bg-gray-100"
            >
              ✕
            </button>
          </div>
        </div>
      )}
    </form>
  );
};

export default BookRoomCta;


