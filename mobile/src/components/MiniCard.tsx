import React from "react";
import { TouchableOpacity, TouchableOpacityProps } from "react-native";
import {
  HStack,
  Text,
  VStack,
  Avatar,
  Center,
  Badge,
  Heading,
} from "native-base";

export interface MiniCardProps {
  participantId: string;
  avatarUrl: string;
  name: string;
  points: number;
}

interface Props extends TouchableOpacityProps {
  data: MiniCardProps;
  position: number;
}

export function MiniCard({ data, position, ...rest }: Props) {
  return (
    <TouchableOpacity {...rest}>
      <HStack
        w="full"
        h={20}
        bgColor="gray.800"
        borderBottomWidth={3}
        borderBottomColor="yellow.500"
        justifyContent="space-between"
        alignItems="center"
        rounded="sm"
        mb={3}
        p={4}
      >
        <VStack>
          <Avatar
            key={data.participantId}
            source={{ uri: data.avatarUrl }}
            w={12}
            h={12}
            rounded="full"
          ></Avatar>
        </VStack>
        <Center>
          <Text color="white" fontSize="sm" fontFamily="heading">
            {data.name}
          </Text>
          <Text color="gray.200" fontSize="xs" fontFamily="body">
            {data.points} ponto(s)
          </Text>
        </Center>
        {position + 1 <= 3 ? (
          <Text>
            <Badge
              w={10}
              h={6}
              bgColor="yellow.500"
              rounded="full"
              marginTop={15}
            >
              <Text fontSize="xs" fontFamily="medium">
                {position + 1}º
              </Text>
            </Badge>
          </Text>
        ) : (
          <Text>
            <Badge
              w={10}
              h={6}
              bgColor="gray.700"
              rounded="full"
              marginTop={15}
            >
              <Text color="gray.500" fontSize="xs" fontFamily="medium">
                {position + 1}º
              </Text>
            </Badge>
          </Text>
        )}
      </HStack>
    </TouchableOpacity>
  );
}
