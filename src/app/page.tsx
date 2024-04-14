import Image from "next/image";
import { redirect } from "next/navigation";

export default async function Home() {
  redirect('/login');
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      Hospital Managment
    </main>
  );
}
