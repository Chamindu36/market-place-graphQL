import { createContext, useState, useEffect } from 'react';
import { gql, useQuery } from '@apollo/client';

import { getCategoriesAndDocuments } from '../utils/firebase/firebase.utils';

export const CategoriesContext = createContext({
  categoriesMap: {},
});

// define graphQL query
const CollectionsQuery = gql`
  query GetCollections {
    collections {
      id
      title
      items {
        id
        name
        price
        imageUrl
      }
    }
  }
`;

export const CategoriesProvider = ({ children }) => {
  // use useQuery hook to fetch data from graphQL server
  const { loading, error, data } = useQuery(CollectionsQuery);

  const [categoriesMap, setCategoriesMap] = useState({});

  useEffect(() => {
    if (data) {
      const { collections } = data;
      const collectionsMap = collections.reduce((accumulator, collection) => {
        accumulator[collection.title.toLowerCase()] = collection.items;
        return accumulator;
      }, {});

      setCategoriesMap(collectionsMap);
    };
  }, [data]);

  const value = { categoriesMap, loading, error };
  return (
    <CategoriesContext.Provider value={value}>
      {children}
    </CategoriesContext.Provider>
  );
};
