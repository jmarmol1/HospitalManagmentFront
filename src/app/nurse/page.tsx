"use client";

import { gql, useQuery } from "@apollo/client";
import Link from "next/link";

const GET_PATIENTS = gql`
  query GetAllPatients {
    getAllPatients {
      _id
      firstName
      lastName
    }
  }
`;

export default function NursePage() {
  const { data, loading, error } = useQuery(GET_PATIENTS);
  
  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error : {error.message}</p>;
  return (
    <main className="flex min-h-screen flex-col bg-gray-300 w-[70%] mx-[15%] p-24">
      <h1 className="text-4xl text-">Nurse</h1>
      <div className="flex flex-col mt-5">
        <h2 className="text-xl font-bold my-5">Patient List:</h2>
        <span className="my-5">
          Clik on a patient to view and add information:
        </span>
        <div className="flex justify-between flex-wrap items-center">
          {data.getAllPatients.map(({ _id, firstName, lastName }) => (
            <Link key={_id} href={`/patients/${_id}`} passHref>
              <div className="bg-gray-600 flex flex-col text-white hover:cursor-pointer rounded-lg p-4">
                <span>
                  <span className=" font-bold">ID:</span> {_id}
                </span>
                <span>
                  <span className=" font-bold">Full name:</span> {firstName}{" "}
                  {lastName}
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </main>
  );
}
