"use client"
import { useSession } from "next-auth/react";
import { redirect } from "next/navigation";

export default function Home() {
  const session = useSession();
  console.log(session.data)
  if (session.status === "authenticated") {
    if(session?.data?.user?.sportsComplexId){
      redirect("/courts")
    }else{
      redirect("add-sports-complex")
    }
  } else if (session.status === "unauthenticated") {
    redirect("/auth/signin");
  }
  return (
    <h1>Welcome to Turfinity</h1>
  );
}
