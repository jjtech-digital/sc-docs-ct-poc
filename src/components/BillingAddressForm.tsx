import { useState } from 'react';

export type BillingAddressFormData = {
  firstName: string;
  lastName: string;
  streetName: string;
  postalCode: string;
  city: string;
  country: string; // ISO-3166-1 alpha-2, e.g. "AU"
};

export default function BillingAddressForm({
  onSubmit,
  initial,
}: {
  initial: BillingAddressFormData;
  onSubmit: (data: BillingAddressFormData) => void;
}) {
  const [addr, setAddr] = useState<BillingAddressFormData>(initial);

  const update =
    (k: keyof BillingAddressFormData) =>
    (e: React.ChangeEvent<HTMLInputElement>) =>
      setAddr({ ...addr, [k]: e.target.value });

  return (
    <form
      className='flex flex-col gap-3'
      onSubmit={(e) => {
        e.preventDefault();
        onSubmit(addr);
      }}
    >
      <input
        required
        placeholder='First name'
        value={addr.firstName}
        onChange={update('firstName')}
      />
      <input
        required
        placeholder='Last name'
        value={addr.lastName}
        onChange={update('lastName')}
      />
      <input
        required
        placeholder='Street'
        value={addr.streetName}
        onChange={update('streetName')}
      />
      <input
        required
        placeholder='Postcode'
        value={addr.postalCode}
        onChange={update('postalCode')}
      />
      <input
        required
        placeholder='City'
        value={addr.city}
        onChange={update('city')}
      />
      <input
        required
        placeholder='Country (AU)'
        value={addr.country}
        onChange={update('country')}
        maxLength={2}
      />
      <button className='bg-black text-white p-2 rounded'>
        Continue to payment
      </button>
    </form>
  );
}
