"use client";

import { gql, useMutation, useQuery } from "@apollo/client";
import { useParams, useRouter } from "next/navigation";
import { useState } from "react";

const GET_PATIENT_DETAILS = gql`
  query GetPatient($patientId: ID!) {
    getPatientDetails(patientId: $patientId) {
      firstName
      lastName
      vitalSigns {
        bodyTemperature
        heartRate
        bloodPressure
        respiratoryRate
        date
      }
    }
  }
`;

const ADD_VITAL_SIGNS = gql`
  mutation AddVitalSigns($patientId: ID!, $vitalSigns: VitalSignInput!) {
    addVitalSignsToPatient(patientId: $patientId, vitalSigns: $vitalSigns)
  }
`;

export default function NursePage() {
  const params = useParams();
  const router = useRouter();
  const { id } = params;
  const patientId = id;
  const [vitalSigns, setVitalSigns] = useState({
    bodyTemperature: "",
    heartRate: "",
    bloodPressure: "",
    respiratoryRate: "",
    date: new Date(),
  });

  const { data, loading, error } = useQuery(GET_PATIENT_DETAILS, {
    variables: { patientId: patientId },
    skip: !id,
  });

  const [
    addVitalSigns,
    { data: mutationData, loading: mutationLoading, error: mutationError },
  ] = useMutation(ADD_VITAL_SIGNS);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setVitalSigns((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    await addVitalSigns({
      variables: {
        patientId: patientId,
        vitalSigns: vitalSigns,
      },
    });
    router.push("/nurse");
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error : {error.message}</p>;
  return (
    <main className="flex min-h-screen flex-col bg-gray-300 w-[70%] mx-[15%] p-24">
      <h1 className="text-4xl text-">Nurse</h1>
      <div className="flex flex-col mt-5">
        <h2 className="text-xl font-bold my-5">
          Edit Patient: <span className=" font-normal">{id}</span>
        </h2>
        <div className="flex flex-col items-center mt-5">
          <h1 className="text-xl font-bold mb-4">
            Patient full name:
            <span className=" font-normal ml-2">
              {data?.getPatientDetails.firstName}{" "}
              {data?.getPatientDetails.lastName}
            </span>
          </h1>

          <span className="text-xl font-bold">Previous Vital signs:</span>
          <ul className="my-2">
            {data?.getPatientDetails.vitalSigns.length > 0 ? (
              data?.getPatientDetails.vitalSigns.map((sign, index) => (
                <li key={index} className="my-2">
                  <b>Date:</b> {sign.date} -
                  <b>Temp:</b> {sign.bodyTemperature}°, <b>Heart Rate:</b> {sign.heartRate}{" "}
                  bpm, <b>Blood Pressure:</b> {sign.bloodPressure}, <b>Respiratory Rate:</b>{" "}
                  {sign.respiratoryRate} breaths/min
                </li>
              ))
            ) : (
              <span>None</span>
            )}
          </ul>

          <div className="mt-6">
            <h2 className="text-xl mb-2">New Vital Signs:</h2>
            <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-4">
              <input
                className="input border p-2"
                type="text"
                name="bodyTemperature"
                value={vitalSigns.bodyTemperature}
                onChange={handleChange}
                placeholder="Body Temperature"
                required
              />
              <input
                className="input border p-2"
                type="text"
                name="heartRate"
                value={vitalSigns.heartRate}
                onChange={handleChange}
                placeholder="Heart Rate"
                required
              />
              <input
                className="input border p-2"
                type="text"
                name="bloodPressure"
                value={vitalSigns.bloodPressure}
                onChange={handleChange}
                placeholder="Blood Pressure"
                required
              />
              <input
                className="input border p-2"
                type="text"
                name="respiratoryRate"
                value={vitalSigns.respiratoryRate}
                onChange={handleChange}
                placeholder="Respiratory Rate"
                required
              />
              <input
                className="input border p-2"
                type="date"
                name="date"
                value={vitalSigns.date}
                onChange={handleChange}
                required
              />
              <button
                type="submit"
                className="col-span-2 bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
              >
                Add Vital Signs
              </button>
            </form>
            {mutationLoading && <p>Adding vital signs...</p>}
            {mutationData && (
              <p>{mutationData.addVitalSignsToPatient.message}</p>
            )}
            {mutationError && (
              <p>Error adding vital signs: {mutationError.message}</p>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
