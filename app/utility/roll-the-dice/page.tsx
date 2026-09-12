import { redirect } from 'next/navigation';

export default function RollTheDiceRedirect() {
  redirect('/utility/dice-roller');
}
