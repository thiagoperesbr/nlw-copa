import { useToast, FlatList, VStack } from "native-base";
import { useState, useEffect } from "react";
import { api } from "../services/api";
import { Loading } from "./Loading";
import { EmptyRankingList } from "./EmptyRankingList";
import { MiniCard } from "./MiniCard";
import { useNavigation } from "@react-navigation/native";

interface Props {
  poolId: string;
}

export function RankingCard({ poolId }: Props) {
  const [isLoading, setIsLoading] = useState(true);
  const [info, setInfo] = useState([]);
  const [ranking, setRanking] = useState([]);
  const { navigate } = useNavigation();

  const toast = useToast();

  async function fetchRanking() {
    try {
      setIsLoading(true);

      const response = await api.get(`/guesses/results/${poolId}`);

      setInfo(response.data.guesses);
    } catch (error) {
      console.log(error);
      toast.show({
        title: "Ainda não foram realizados palpites nesse bolão.",
        placement: "top",
        bgColor: "red.500",
      });
    } finally {
      setIsLoading(false);
    }
  }

  function validatePoints(info) {
    const points = 0;

    let dadosRanking;
    dadosRanking = info.map(function (dados) {
      if (new Date(dados.game.date).getTime() >= new Date().getTime())
        if (
          dados.firstTeamPoints === dados.game.resultFirstTeamPoints &&
          dados.secondTeamPoints === dados.game.resultSecondTeamPoints
        ) {
          return { dados, pontuacao: points + 25 };
        } else if (
          dados.firstTeamPoints > dados.secondTeamPoints &&
          dados.firstTeamPoints === dados.game.resultFirstTeamPoints &&
          dados.secondTeamPoints !== dados.game.resultSecondTeamPoints
        ) {
          return { dados, pontuacao: points + 18 };
        } else if (
          dados.secondTeamPoints > dados.firstTeamPoints &&
          dados.secondTeamPoints === dados.game.resultSecondTeamPoints &&
          dados.firstTeamPoints !== dados.game.resultFirstTeamPoints
        ) {
          return { dados, pontuacao: points + 18 };
        } else if (
          dados.firstTeamPoints > dados.secondTeamPoints &&
          dados.firstTeamPoints !== dados.game.resultFirstTeamPoints &&
          dados.secondTeamPoints === dados.game.resultSecondTeamPoints
        ) {
          return { dados, pontuacao: points + 12 };
        } else if (
          dados.secondTeamPoints > dados.firstTeamPoints &&
          dados.secondTeamPoints !== dados.game.resultSecondTeamPoints &&
          dados.firstTeamPoints === dados.game.resultFirstTeamPoints
        ) {
          return { dados, pontuacao: points + 12 };
        } else if (
          dados.firstTeamPoints > dados.secondTeamPoints &&
          dados.game.resultFirstTeamPoints >
            dados.game.resultSecondTeamPoints &&
          dados.firstTeamPoints !== dados.game.resultFirstTeamPoints &&
          dados.secondTeamPoints !== dados.game.resultSecondTeamPoints
        ) {
          return { dados, pontuacao: points + 8 };
        } else if (
          dados.secondTeamPoints > dados.firstTeamPoints &&
          dados.game.resultSecondTeamPoints >
            dados.game.resultFirstTeamPoints &&
          dados.secondTeamPoints !== dados.game.resultSecondTeamPoints &&
          dados.firstTeamPoints !== dados.game.resultFirstTeamPoints
        ) {
          return { dados, pontuacao: points + 8 };
        } else if (
          dados.firstTeamPoints === dados.secondTeamPoints &&
          dados.game.resultFirstTeamPoints ===
            dados.game.resultSecondTeamPoints &&
          dados.firstTeamPoints !== dados.game.resultFirstTeamPoints &&
          dados.secondTeamPoints !== dados.game.resultSecondTeamPoints
        ) {
          return { dados, pontuacao: points + 8 };
        } else {
          return { dados, pontuacao: points };
        }
      else {
        return { dados, pontuacao: points };
      }
    });

    let posicaoRanking = dadosRanking.reduce(function (totalPontos, dado) {
      if (totalPontos[dado.dados.participantId]) {
        totalPontos[dado.dados.participantId].points += dado.pontuacao;
      } else {
        totalPontos[dado.dados.participantId] = {
          participantId: dado.dados.participantId,
          name: dado.dados.participant.user.name,
          avatarUrl: dado.dados.participant.user.avatarUrl,
          points: dado.pontuacao,
        };
      }
      return totalPontos;
    }, {});

    setRanking(Object.values(posicaoRanking));
  }

  useEffect(() => {
    fetchRanking();
  }, [poolId]);

  useEffect(() => {
    validatePoints(info);
  }, [info]);

  ranking.sort(function (x, y) {
    return x.points - y.points;
  });

  ranking.reverse();

  return (
    <VStack flex={1} bgColor="gray.900">
      {isLoading ? (
        <Loading />
      ) : (
        <FlatList
          data={ranking}
          keyExtractor={(item) => item.participantId}
          renderItem={({ item, index }) => (
            <MiniCard key={item.participantId} data={item} position={index} />
          )}
          contentContainerStyle={{ paddingBottom: 100 }}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={() => <EmptyRankingList />}
          _contentContainerStyle={{ pb: 10 }}
          px={5}
        />
      )}
    </VStack>
  );
}
