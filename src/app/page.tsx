"use client";

import { Calendar } from "@yamada-ui/calendar";
import { RefreshCwIcon } from "@yamada-ui/lucide";
import {
  Button,
  Center,
  Container,
  Dialog,
  DialogBody,
  Heading,
  HStack,
  IconButton,
  Image,
  SegmentedControl,
  SegmentedControlItem,
  Select,
  SelectItem,
  Text,
  Textarea,
  useDisclosure,
  VStack,
} from "@yamada-ui/react";
import React, { useRef, useState } from "react";

import { Level, useCreatePromiseMutation } from "@/generated/graphql";
import { createMessageString, getDueDate } from "@/lib/control-form";
import { gestUser } from "@/lib/mockData";

import { UserCard } from "./_components/Card";
import { HomeButton } from "./_components/GoBackButton";
import { useLiff } from "./providers/LiffProvider";

const importanceItems: SegmentedControlItem[] = [
  { label: "軽い約束", value: Level.Low },
  { label: "少し重要", value: Level.Medium },
  { label: "お金が絡む", value: Level.High },
];

const dueDateItems: SelectItem[] = [
  { label: "期限なし", value: "none" },
  { label: "1日", value: "1day" },
  { label: "1週間", value: "1week" },
  { label: "1か月", value: "1month" },
  { label: "その他", value: "other" },
];

export default function Home() {
  const { user, liff } = useLiff();
  const { onOpen, onClose } = useDisclosure();
  const [importance, setImportance] = useState<Level>(Level.Low);
  const textContentRef = useRef<HTMLTextAreaElement | null>(null);
  const [selectDueDateType, setSelectDueDateType] = useState<string>("none");
  const [createPromise, { loading }] = useCreatePromiseMutation();
  const [dueDate, setDueDate] = useState<Date>(new Date());

  const [isReverse, setIsReverse] = useState(false);

  const handleReverse = () => {
    setIsReverse(!isReverse);
  };

  return (
    <React.Fragment>
      <Dialog
        open={loading}
        onClose={onClose}
        header="約束を用意中..."
        size="md"
      >
        <DialogBody alignItems="center">
          <Image
            src="/loading_icon.png"
            alt="loading"
            width={140}
            height={140}
          />
        </DialogBody>
      </Dialog>
      <VStack w="full" px={8} py={4} gap={4}>
        <HomeButton />
        <Heading py={2}>約束をプチる</Heading>
        <VStack w="full" alignItems="center">
          <Container
            bgColor="primary"
            color="white"
            rounded="md"
            alignItems="center"
            fontWeight={600}
            py={2}
            maxH={12}
            justifyContent="center"
          >
            <Text fontWeight={800}>約束の内容は？</Text>
          </Container>
          <VStack alignItems="center" gap={0}>
            <HStack gap={6}>
              <UserCard user={isReverse ? gestUser : user} color="primary" />
              <Text fontSize="6xl">が</Text>
              <UserCard user={isReverse ? user : gestUser} color="primary" />
              <Text fontSize="6xl">に</Text>
            </HStack>
            <Center pr={20}>
              <IconButton
                zIndex={10}
                icon={<RefreshCwIcon />}
                aria-label="left-right"
                fontSize="24"
                colorScheme="primary"
                h="12"
                w="12"
                rounded="full"
                onClick={handleReverse}
                boxShadow="0px 4px teal"
                transition="all 0.2s ease"
                _active={{
                  transform: "translateY(2px) scale(0.9) rotate(180deg)",
                  backgroundColor: "teal.800",
                  boxshadow: "none",
                }}
              />
            </Center>
          </VStack>
          <Textarea
            variant="filled"
            placeholder="回らない寿司を奢る"
            h="32"
            focusBorderColor="teal.500"
            ref={textContentRef}
            border={"2px solid"}
            borderColor="border"
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
              value={importance}
              onChange={(value) => setImportance(value as Level)}
              boxShadow={"0px 4px #9C9C9CFF"}
              transition={"all 0.2s ease"}
              _active={{
                transform: "translateY(2px)",
                backgroundColor: "gray.50",
                boxshadow: "none",
              }}
            ></SegmentedControl>
          </HStack>

          <HStack
            justifyContent="space-between"
            alignItems="center"
            p={2}
            w="full"
          >
            <Text w="full">期限</Text>
            <VStack p={"null"} m={"null"}>
              <Select
                w="60"
                placeholder="期限を選択"
                focusBorderColor="teal.500"
                onChange={(value) => {
                  setSelectDueDateType(value);
                }}
                items={dueDateItems}
                boxShadow={"0px 4px #9C9C9CFF"}
                _active={{
                  transform: "translateY(2px)",
                  backgroundColor: "gray.50",
                  boxshadow: "none",
                }}
              ></Select>
              {selectDueDateType === "other" && (
                <Calendar
                  value={dueDate}
                  onChange={(date: React.SetStateAction<Date>) => {
                    setDueDate(date);
                  }}
                />
              )}
            </VStack>
          </HStack>
        </VStack>
        {user ? (
          <Button
            py={4}
            colorScheme="secondary"
            rounded="full"
            size="lg"
            fontWeight={800}
            boxShadow="0px 6px #EB777B"
            transition="all 0.2s ease"
            _active={{
              transform: "translateY(2px)",
              backgroundColor: "pink.800",
              boxshadow: "none",
            }}
            onClick={async () => {
              if (!liff) return;
              onOpen();
              const result = await createPromise({
                variables: {
                  input: {
                    direction: isReverse,
                    content: textContentRef.current?.value ?? "",
                    level: importance,
                    dueDate:
                      getDueDate(selectDueDateType) ?? dueDate.toISOString(),
                  },
                },
              });
              console.log(result);
              const promiseId = result.data?.createPromise?.id;
              liff
                .shareTargetPicker(
                  [
                    {
                      type: "text",
                      text: createMessageString(user, importance),
                    },
                    {
                      type: "text",
                      text:
                        `https://liff.line.me/${process.env.NEXT_PUBLIC_LIFF_ID}` +
                        `/?query=${promiseId}`,
                    },
                  ],
                  {
                    isMultiple: true,
                  }
                )
                .then(function (res) {
                  if (res) {
                    console.log(`[${res.status}] Message sent!`);
                  } else {
                    console.log("TargetPicker was closed!");
                  }
                })
                .catch(function (error) {
                  alert(error);
                });
              onClose();
            }}
          >
            約束する
          </Button>
        ) : null}
      </VStack>
    </React.Fragment>
  );
}

