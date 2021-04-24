import React, { useEffect, useState } from 'react'
import { StyleSheet, View, Text, Image, Alert } from 'react-native'
import { FlatList } from 'react-native-gesture-handler'

import { formatDistance } from 'date-fns'
import { ptBR } from 'date-fns/locale'

import { Header } from '../components/Header'
import { loadPlants, PlantProps } from '../libs/storage'

import waterDrop from '../assets/waterdrop.png'

import colors from '../styles/colors'
import fonts from '../styles/fonts'

export function MyPlants() {
  const [myPlants, setMyPlants] = useState<PlantProps[]>([])
  const [loading, setLoading] = useState(true)
  const [nextWaterd, setNextWaterd] = useState<string>()

  useEffect(() => {
    async function loadStorageData() {
      const plantsStoraged = await loadPlants()

      if (!plantsStoraged || plantsStoraged.length === 0)
        return Alert.alert('Ops, nenhuma planta cadastrada')

      const nextTime = formatDistance(
        new Date(plantsStoraged[0].dateTimeNotification).getTime(),
        new Date().getTime(),
        {
          locale: ptBR,
        }
      )

      setNextWaterd(
        `Não esqueça de regar a ${plantsStoraged[0].name} à ${nextTime}`
      )

      setMyPlants(plantsStoraged)
      setLoading(false)
    }

    loadStorageData()

    return () => {
      setMyPlants([])
    }
  }, [])

  return (
    <View style={styles.container}>
      <Header />

      <View style={styles.spotlight}>
        <Image source={waterDrop} style={styles.spotlightImage}></Image>
        <Text style={styles.spotlightText}>{nextWaterd}</Text>
      </View>

      <View style={styles.plants}>
        <Text style={styles.plantsTitle}>Próximas regadas</Text>

        <FlatList
          data={myPlants}
          keyExtractor={(item) => item.id.toString()}
          renderItem={() => <Text>Elemento</Text>}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ flex: 1 }}
        ></FlatList>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 30,
    paddingTop: 50,
    backgroundColor: colors.background,
  },
  spotlight: {
    backgroundColor: colors.blue_light,
    paddingHorizontal: 20,
    borderRadius: 20,
    height: 110,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  spotlightImage: {
    width: 60,
    height: 60,
  },
  spotlightText: {
    flex: 1,
    color: colors.blue,
    padding: 20,
    textAlign: 'justify',
  },
  plants: {
    flex: 1,
    width: '100%',
  },
  plantsTitle: {
    fontSize: 24,
    fontFamily: fonts.heading,
    color: colors.heading,
    marginVertical: 20,
  },
})
