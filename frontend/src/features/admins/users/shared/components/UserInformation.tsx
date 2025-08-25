import AsyncState from '@/features/shared/components/async-state/AsyncState';
import { useGetOneQuery } from '@/infrastructure/tenants/tenant.redux.api';
import { Box } from '@chakra-ui/react';
import React from 'react';

export default function UserInformation({ id }: { id: number }) {
  const { data: userData, error, isError, isLoading } = useGetOneQuery(id);
  return (
    <AsyncState
      isError={isError}
      isLoading={isLoading}
      globalOverlay={false}
      errorObject={error}
      errorBody={(err) => {
        // Narrow types if possible
        if ('status' in err) {
          if (err.status >= '500') {
            return (
              <Box>
                🚨 Server error (500): something went wrong on our side.
              </Box>
            );
          }

          if (err.status >= '400') {
            return (
              <Box>
                ⚠️ Client error ({err.status}): maybe bad request or
                unauthorized.
                {/* <pre>{JSON.stringify(err.data, null, 2)}</pre> */}
              </Box>
            );
          }
        }

        // Fallback for unknown error shapes
        return (
          <Box color="gray.500">
            ❓ Unexpected error
            <pre>{JSON.stringify(err, null, 2)}</pre>
          </Box>
        );
      }}
    >
      {userData && (
        <div>
          Hellow
          <div>ID: {userData.id}</div>
          <div>Firstname: {userData.firstname}</div>
          <div>Lastname: {userData.lastname}</div>
          <div>Age: {userData.age}</div>
          <div>Verified: {userData.isVerified ? 'true' : 'false'}</div>
          <div>Active: {userData.isActive ? 'true' : 'false'}</div>
          <div>Phone Number: {userData.phone_number}</div>
          <div>Guardian: {userData.guardian}</div>
          <div>Account Created At: {userData.createdAt}</div>
        </div>
      )}
    </AsyncState>
  );
}
