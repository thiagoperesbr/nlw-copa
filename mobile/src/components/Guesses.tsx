import { useState, useEffect, useCallback } from "react";
import { useFocusEffect } from "@react-navigation/native";
import { FlatList, useToast } from "native-base";

import { api } from "../services/api";

import { Game, GameProps } from "../components/Game";
import { Loading } from "./Loading";
import { EmptyMyPoolList } from "./EmptyMyPoolList";

interface Props {
  poolId: string;
  code: string;
}

export function Guesses({ poolId, code }: Props) {
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingAposta, setIsLoadingAposta] = useState(false);
  const [games, setGames] = useState<GameProps[]>([]);
  const [firstTeamPoints, setFirstTeamPoints] = useState("");
  const [secondTeamPoints, setSecondTeamPoints] = useState("");

  const toast = useToast();

  async function fetchGames() {
    try {
      setIsLoading(true);

      const response = await api.get(`/pools/${poolId}/games`);
      setGames(response.data.games);
    } catch (error) {
      console.log(error);
      toast.show({
        title: "Não foi possível carregar os bolões",
        placement: "top",
        bgColor: "red.500",
      });
    } finally {
      setIsLoading(false);
    }
  }

  async function handleGuessConfirm(gameId: string) {
    try {
      setIsLoadingAposta(true);

      if (!firstTeamPoints.trim() || !secondTeamPoints.trim()) {
        setTimeout(function () {
          setIsLoadingAposta(false);
        }, 2000);

        toast.show({
          title: "Informe o placar do palpite",
          placement: "top",
          bgColor: "red.500",
        });
      } else {
        await api.post(`/pools/${poolId}/games/${gameId}/guesses`, {
          firstTeamPoints: Number(firstTeamPoints),
          secondTeamPoints: Number(secondTeamPoints),
        });

        toast.show({
          title: "Palpite efetuado com sucesso",
          placement: "top",
          bgColor: "green.500",
        });

        setIsLoadingAposta(false);
        fetchGames();
      }
    } catch (error) {
      console.log(error);
      toast.show({
        title: "Não foi possível enviar o palpite",
        placement: "top",
        bgColor: "red.500",
      });
    }
  }

  useEffect(() => {
    fetchGames();
  }, [poolId]);

  if (isLoading) {
    return <Loading />;
  }

  return (
    <FlatList
      data={games}
      keyExtractor={(item) => item.id}
      renderItem={({ item }) => (
        <Game
          data={item}
          key={item.id}
          setFirstTeamPoints={setFirstTeamPoints}
          setSecondTeamPoints={setSecondTeamPoints}
          onGuessConfirm={() => handleGuessConfirm(item.id)}
          isLoaded={isLoadingAposta}
        />
      )}
      contentContainerStyle={{ paddingBottom: 100 }}
      _contentContainerStyle={{ pb: 10 }}
      ListEmptyComponent={() => <EmptyMyPoolList code={code} />}
    />
  );
}
