import { redirect } from 'next/navigation';

export default function StationSingularRedirect({ params }: { params: { id: string } }) {
  redirect(`/stations/${params.id}`);
}
