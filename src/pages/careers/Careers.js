import React, { useEffect } from "react";
import { useQuery } from "react-query";
import { Await, Link, defer, useLoaderData } from "react-router-dom";

const QUERY_KEY = "contacts";

const commonQueryParams = {
  queryKey: [QUERY_KEY],
  queryFn: () => fetch("http://localhost:4000/careers").then(res => res.json()),
};

export default function Careers() {
  const { data, refetch } = useQuery({
    ...commonQueryParams,
    enabled: false,
  });

  const { isData, packageLocationData } = useLoaderData();

  useEffect(() => {
    if (isData) {
      refetch();
    }
  }, [isData]);

  return (
    <div className="careers">
      <React.Suspense fallback={<p>LOADING IN CAREERS</p>}>
        <Await resolve={packageLocationData} errorElement={<p>Error loading package location!</p>}>
          {packageLocationData => {
            const finalData = isData ? data : packageLocationData;

            return finalData.map(career => (
              <Link to={career.id.toString()} key={career.id}>
                <p>{career.title}</p>
                <p>Based in {career.location}</p>
              </Link>
            ));
          }}
        </Await>
      </React.Suspense>
    </div>
  );
}

const data = [
  {
    id: 1,
    title: "Senior React Developer",
    salary: 50000,
    location: "London, UK",
  },
  {
    id: 2,
    title: "Plumber",
    salary: 40000,
    location: "Bowser's Castle",
  },
  {
    id: 3,
    title: "Gym Leader",
    salary: 75000,
    location: "Kanto Region",
  },
  {
    id: 4,
    title: "Vue Developer",
    salary: 40000,
    location: "Liverpool, UK",
  },
  {
    id: 5,
    title: "Tutorial Maker",
    salary: 35000,
    location: "Manchester, UK",
  },
  {
    id: 6,
    title: "Website Manager",
    salary: 50000,
    location: "Berlin, Germany",
  },
  {
    id: 7,
    title: "Food Tester",
    salary: 30000,
    location: "London, UK",
  },
];

// data loader
export const careersLoader = async queryClient => {
  const cachedData = queryClient.getQueryData(QUERY_KEY);

  const getCareers = () =>
    queryClient.fetchQuery({
      ...commonQueryParams,
    });

  return defer({
    isData: !!cachedData,
    packageLocationData: cachedData ? new Promise(resolve => resolve(data)) : getCareers(),
  });
};
