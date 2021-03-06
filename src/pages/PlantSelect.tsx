import React, { useEffect, useState } from 'react'
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Platform,
  ActivityIndicator,
} from 'react-native'
import { useNavigation } from '@react-navigation/core'

import { Header } from '../components/Header'
import { PlantCardPrimary } from '../components/PlantCardPrimary'
import { Load } from '../components/Load'
import { EnvironmentButton } from '../components/EnvironmentButton'

import { PlantProps } from '../libs/storage'

import api from '../services/api'

import colors from '../styles/colors'
import fonts from '../styles/fonts'

interface EnvironmentProps {
  key: string
  title: string
}

export function PlantSelect() {
  const [environments, setEnvironments] = useState<EnvironmentProps[]>([])
  const [plants, setPlants] = useState<PlantProps[]>([])
  const [filteredPlants, setFilteredPlants] = useState<PlantProps[]>([])
  const [environmentSelected, setEnvironmentSelected] = useState('all')
  const [loading, setLoading] = useState(true)

  const [page, setPage] = useState(1)
  const [loadingMore, setLoadingMore] = useState(false)

  const navigation = useNavigation()

  async function fetchPlants() {
    const { data } = await api.get<PlantProps[]>(
      `plants?_sort=name&_order=asc&_page=${page}&_limit=6`
    )

    if (!data) return setLoading(true)
    if (page > 1) {
      setPlants((oldValue) => [...oldValue, ...data])
      setFilteredPlants((oldValue) => [...oldValue, ...data])
    } else {
      setPlants(data)
      setFilteredPlants(data)
    }

    setLoading(false)
    setLoadingMore(false)
  }

  function handleEnvironmentSelected(environment: string) {
    setEnvironmentSelected(environment)

    if (environment === 'all') return setFilteredPlants(plants)

    const filtered = plants.filter((plant) =>
      plant.environments.includes(environment)
    )

    setFilteredPlants(filtered)
  }

  async function handleFetchMore(distance: number) {
    //  rolando para cima, logo não precisa de carregamento
    if (distance < 1) return

    setLoadingMore(true)
    setPage((oldValue) => oldValue + 1)
    await fetchPlants()
  }

  function handlePlantSelect(plant: PlantProps) {
    navigation.navigate('PlantSave', { plant })
  }

  useEffect(() => {
    async function fetchEnvironment() {
      const { data } = await api.get<EnvironmentProps[]>(
        'plants_environments?_sort=title&_order=asc'
      )
      setEnvironments([{ key: 'all', title: 'Todos' }, ...data])
    }

    fetchEnvironment()

    return () => {
      setEnvironments([])
    }
  }, [])

  useEffect(() => {
    fetchPlants()

    return () => {
      setPlants([])
    }
  }, [])

  if (loading && Platform.OS !== 'web') return <Load />

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Header></Header>

        <Text style={styles.title}>Em qual ambiente</Text>
        <Text style={styles.subtitle}>você quer colocar sua planta?</Text>
      </View>

      <View>
        <FlatList
          data={environments}
          renderItem={({ item }) => (
            <EnvironmentButton
              title={item.title}
              active={item.key == environmentSelected}
              onPress={() => handleEnvironmentSelected(item.key)}
            />
          )}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.environmentList}
          keyExtractor={(item) => item.key.toString()}
        ></FlatList>
      </View>

      <View style={styles.plants}>
        <FlatList
          data={filteredPlants}
          renderItem={({ item }) => (
            <PlantCardPrimary
              key={item.id}
              data={item}
              onPress={() => handlePlantSelect(item)}
            />
          )}
          showsVerticalScrollIndicator={false}
          numColumns={2}
          keyExtractor={(item) => item.id.toString()}
          onEndReachedThreshold={0.1} //  Distância faltando 10% para o fim da página
          onEndReached={({ distanceFromEnd }) =>
            handleFetchMore(distanceFromEnd)
          }
          ListFooterComponent={
            loadingMore ? <ActivityIndicator color={colors.green} /> : <></>
          }
        ></FlatList>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // justifyContent: 'center',
    // alignItems: 'center',
    backgroundColor: colors.background,
  },
  header: {
    paddingHorizontal: 30,
  },
  title: {
    fontSize: 17,
    color: colors.heading,
    fontFamily: fonts.heading,
    lineHeight: 20,
    marginTop: 15,
  },
  subtitle: {
    fontSize: 17,
    color: colors.heading,
    fontFamily: fonts.text,
    lineHeight: 20,
  },
  environmentList: {
    height: 40,
    justifyContent: 'center',
    paddingBottom: 5,
    marginLeft: 32,
    marginVertical: 32,
  },
  plants: {
    flex: 1,
    paddingHorizontal: 32,
    justifyContent: 'center',
  },
})
