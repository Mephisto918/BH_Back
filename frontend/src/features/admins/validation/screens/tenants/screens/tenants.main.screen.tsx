import React from 'react';

import BaseWrapper from '@/features/shared/layouts/wrappers/base-wrapper';
import { Box, HStack } from '@chakra-ui/react';
import { Colors } from '@/features/constants';

export default function TenantsMainScreen() {
  return (
    <BaseWrapper>
      TenantsMainScreen
      <HStack>
        {Colors.PrimaryLight.map((color) => {
          return (
            <div
              style={{
                backgroundColor: color,
                width: '100px',
                height: '100px',
              }}
            ></div>
          );
        })}
      </HStack>
    </BaseWrapper>
  );
}
