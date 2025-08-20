'use client';

import { Dispatch, FC, SetStateAction, useState } from "react";
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { useRouter } from "next/navigation";

type Props = {
  checkinDate: Date | null;
  setCheckinDate: Dispatch<SetStateAction<Date | null>>;
  checkoutDate: Date | null;
  setCheckoutDate: Dispatch<SetStateAction<Date | null>>;
  setAdults: Dispatch<SetStateAction<number>>;
  setNoOfChildren: Dispatch<SetStateAction<number>>;
  calcMinCheckoutDate: () => Date | null;
  price: number;
  discount: number;
  adults: number;
  noOfChildren: number;
  specialNote: string;
  isBooked: boolean;
  handleBookNowClick: () => void;
};

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
    handleBookNowClick,
  } = props;

  const [errors, setErrors] = useState<{ checkin?: string; checkout?: string }>({});
  const router = useRouter();

  const nightlyPrice = Math.round(price * (1 - (discount || 0) / 100));
  const nights = checkinDate && checkoutDate
    ? Math.ceil((checkoutDate.getTime() - checkinDate.getTime()) / (1000 * 60 * 60 * 24))
    : 0;

  const totalCOP = nights > 0 ? nightlyPrice * nights : 0;

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const errs: { checkin?: string; checkout?: string } = {};
    if (!checkinDate) errs.checkin = "Selecciona la fecha de entrada";
    if (!checkoutDate) errs.checkout = "Selecciona la fecha de salida";
    setErrors(errs);

    if (Object.keys(errs).length === 0) {
      // Guardar en localStorage (opcional)
      localStorage.setItem("reserva", JSON.stringify({
        checkinDate,
        checkoutDate,
        adults,
        noOfChildren,
        nights,
        totalCOP,
        price,
        discount,
        specialNote
      }));

      // Redirigir a la vista de datos personales
      window.open('/personal-info', '_blank');
    }
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
          <label htmlFor="check-in-date">Check In date
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
        </div>

        <div className="w-1/2 pl-2">
          <label htmlFor="check-out-date">Check Out date</label>
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
          />       </div>
      </div>

      <div className="flex mt-4">
        <div className="w-1/2 pr-2">
          <label htmlFor="adults">Adults</label>
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
          <label htmlFor="children">Children</label>
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
    </form>
  );
};

export default BookRoomCta;
