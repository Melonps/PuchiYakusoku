"use client";

import { ArrowRightLeft } from "@yamada-ui/lucide";
import {
  Box,
  Button,
  Container,
  Heading,
  HStack,
  IconButton,
  Option,
  SegmentedControl,
  SegmentedControlButton,
  SegmentedControlItem,
  Select,
  Text,
  Textarea,
  VStack,
} from "@yamada-ui/react";
import { useState } from "react";

import { useGetPromisesQuery } from "@/generated/graphql";
import { exampleUser } from "@/lib/mockData";

import { UserCard } from "./_components/Card";
import { Header } from "./_components/Header";
import { useLiff } from "@/hooks/useLiff";

const importanceItems: SegmentedControlItem[] = [
  { label: "軽い約束", value: "low" },
  { label: "少し重要", value: "medium" },
  { label: "お金が絡む", value: "high" },
];

export default function Home() {
  const { user, loginLiff } = useLiff();
  const { data, loading, error } = useGetPromisesQuery();
  console.log(data);
  console.log(loading);
  console.log(error);
  const [leftright, setLeftRight] = useState(false);

  const handleLeftRight = () => {
    setLeftRight(!leftright);
  };
  console.log(user);

  return (
    <Container
      w="full"
      minH="100vh"
      alignItems="center"
      p="0"
      backgroundColor="red.50"
    >
      <Box w="100%" maxW="480px" backgroundColor="white" p={4}>
        <Header />
        <VStack w="full" p={4} gap={4}>
          <VStack w="full">
            <Container
              p={2}
              bgColor="primary"
              color="white"
              rounded="md"
              alignItems="center"
              fontWeight={600}
            >
              約束の内容は？
            </Container>
            {user ? (
              leftright ? (
                <HStack>
                  <UserCard user={user} />
                  <Text fontSize="6xl">が</Text>
                  <UserCard user={exampleUser} />
                  <Text fontSize="6xl">に</Text>
                </HStack>
              ) : (
                <HStack>
                  <UserCard user={exampleUser} />
                  <Text fontSize="6xl">が</Text>
                  <UserCard user={user} />
                  <Text fontSize="6xl">に</Text>
                </HStack>
              )
            ) : (
              <Heading size="md" p={4}>
                ようこそ、ゲストさん
              </Heading>
            )}
            <IconButton
              icon={<ArrowRightLeft />}
              aria-label="left-right"
              colorScheme="primary"
              onClick={handleLeftRight}
            />
            <Textarea
              variant="filled"
              placeholder="○○を△△する"
              h="32"
              focusBorderColor="teal.500"
            />
            <HStack
              w="full"
              justifyContent="space-between"
              alignItems="center"
              p={2}
            >
              <Text>重要度</Text>
              <SegmentedControl
                colorScheme="primary"
                backgroundColor="gray.50"
                defaultValue="low"
                size="sm"
                items={importanceItems}
              ></SegmentedControl>
            </HStack>

            <HStack
              w="full"
              justifyContent="space-between"
              alignItems="center"
              p={2}
            >
              <Text minW="60px">期限</Text>
              <Select placeholder="期限を選択" focusBorderColor="teal.500">
                <Option value="期限なし">期限なし</Option>
                <Option value="1日">1日</Option>
                <Option value="1週間">1週間</Option>
                <Option value="1か月">1か月</Option>
                <Option value="その他">その他</Option>
              </Select>
            </HStack>

            <Button
              colorScheme="secondary"
              onClick={() => {
                loginLiff();
              }}
            >
              ログイン（本番では消す）
            </Button>
          </VStack>
        </VStack>
      </Box>
    </Container>
  );
}
