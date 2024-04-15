"use client";

import { gql, useMutation, useQuery } from "@apollo/client";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

interface CommonSigns {
  [key: string]: boolean;
  fever: boolean;
  cough: boolean;
  fatigue: boolean;
  headache: boolean;
  bodyAche: boolean;
}

const GET_PATIENT_DETAILS = gql`
  query GetPatient($patientId: ID!) {
    getPatientDetails(patientId: $patientId) {
      firstName
      lastName
      commonSigns {
        fever
        cough
        fatigue
        headache
        bodyAche
      }
    }
  }
`;

const ADD_VITAL_SIGNS = gql`
  mutation AddVitalSigns($patientId: ID!, $vitalSigns: VitalSignInput!) {
    addVitalSignsToPatient(patientId: $patientId, vitalSigns: $vitalSigns)
  }
`;

const UPDATE_COMMON_SIGNS = gql`
  mutation updateCommonSigns($patientId: ID!, $commonSigns: CommonSignsInput!) {
    updateCommonSigns(patientId: $patientId, commonSigns: $commonSigns)
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
    date: "",
  });

  const [commonSigns, setCommonSigns] = useState<CommonSigns>({
    fever: false,
    cough: false,
    fatigue: false,
    headache: false,
    bodyAche: false,
  });

  const { data, loading, error } = useQuery(GET_PATIENT_DETAILS, {
    variables: { patientId: patientId },
    skip: !id,
    onCompleted: (data: any) => {
      if (
        data &&
        data.getPatientDetails &&
        data.getPatientDetails.commonSigns
      ) {
        setCommonSigns({
          fever: data.getPatientDetails.commonSigns.fever,
          cough: data.getPatientDetails.commonSigns.cough,
          fatigue: data.getPatientDetails.commonSigns.fatigue,
          headache: data.getPatientDetails.commonSigns.headache,
          bodyAche: data.getPatientDetails.commonSigns.bodyAche,
        });
      }
    },
  });

  const [
    addVitalSigns,
    { data: mutationData, loading: mutationLoading, error: mutationError },
  ] = useMutation(ADD_VITAL_SIGNS);

  const [
    updateCommonSigns,
    {
      data: updateCommonSignsData,
      loading: updateCommonSignsLoading,
      error: updateCommonSignsError,
    },
  ] = useMutation(UPDATE_COMMON_SIGNS);

  const handleChange = (event: { target: { name: any; value: any } }) => {
    const { name, value } = event.target;
    setVitalSigns((prev: any) => ({ ...prev, [name]: value }));
  };

  const handleChangeCommon = (event: {
    target: { name: any; checked: any };
  }) => {
    const { name, checked } = event.target;
    setCommonSigns((prev) => ({
      ...prev,
      [name as keyof CommonSigns]: checked,
    }));
  };

  const handleSubmit = async (event: { preventDefault: () => void }) => {
    event.preventDefault();
    await addVitalSigns({
      variables: {
        patientId: patientId,
        vitalSigns: vitalSigns,
      },
    });

    setVitalSigns({
      bodyTemperature: "",
      heartRate: "",
      bloodPressure: "",
      respiratoryRate: "",
      date: "",
    });
  };

  const handleSubmitCommon = async (event: { preventDefault: () => void }) => {
    event.preventDefault();
    await updateCommonSigns({
      variables: {
        patientId: patientId,
        commonSigns: commonSigns,
      },
    });
  };

  useEffect(() => {
    if (data && data.getPatientDetails && data.getPatientDetails.commonSigns) {
      setCommonSigns({
        fever: data.getPatientDetails.commonSigns.fever,
        cough: data.getPatientDetails.commonSigns.cough,
        fatigue: data.getPatientDetails.commonSigns.fatigue,
        headache: data.getPatientDetails.commonSigns.headache,
        bodyAche: data.getPatientDetails.commonSigns.bodyAche,
      });
    }
  }, [data]);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error : {error.message}</p>;
  return (
    <main className="flex min-h-screen flex-col bg-gray-300 w-[70%] mx-[15%] p-24">
      <h1 className="text-4xl text-">Patient</h1>
      <div className="flex flex-col mt-5">
        <h2 className="text-xl font-bold my-5">
          Patient: <span className=" font-normal">{id}</span>
        </h2>
        <div className="flex flex-col items-center mt-5">
          <h1 className="text-xl font-bold mb-4">
            Hi,
            <span className=" font-normal ml-2">
              {data?.getPatientDetails.firstName}{" "}
              {data?.getPatientDetails.lastName}!
            </span>
          </h1>
          <div className="mt-6">
            <h2 className="text-xl mb-2 text-center">New daily Vital Signs:</h2>
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
          <div className="mt-6 justify-center text-center">
            <h2 className="text-xl mb-2 text-center">Common signs:</h2>
            <form onSubmit={handleSubmitCommon} className="mt-2">
              <div className="flex flex-col items-center">
                {Object.keys(commonSigns).map((sign, index) => {
                  return (
                    <label
                      key={index}
                      className="inline-flex items-center mt-3"
                    >
                      <input
                        type="checkbox"
                        name={sign}
                        checked={commonSigns[sign]}
                        onChange={handleChangeCommon}
                        className="form-checkbox h-5 w-5 text-gray-600"
                      />
                      <span className="ml-2 text-gray-700 capitalize">
                        {sign}
                      </span>
                    </label>
                  );
                })}
              </div>
              <button
                type="submit"
                className="mt-4 justify-center bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
              >
                Update Common Signs
              </button>
              {updateCommonSignsData && (
                <p className=" justify-center mt-4 text-green-700">
                  Common signs updated successfully
                </p>
              )}
            </form>
          </div>
        </div>
      </div>
    </main>
  );
}
