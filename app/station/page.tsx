import { redirect } from 'next/navigation';

export default function StationIndexRedirect() {
  redirect('/explore');
}
