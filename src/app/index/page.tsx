import { redirect } from 'next/navigation';

export const dynamic = 'force-dynamic';

export default function IndexRedirect() {
  redirect('/choose-role');
}
