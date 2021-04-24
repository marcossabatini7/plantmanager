import React, { useEffect, useState } from 'react'
import { View, Text, StyleSheet, FlatList, Platform } from 'react-native'
import { EnvironmentButton } from '../components/EnvironmentButton'

import { Header } from '../components/Header'
import { PlantCardPrimary } from '../components/PlantCardPrimary'
import { Load } from '../components/Load'

import api from '../services/api'

import colors from '../styles/colors'
import fonts from '../styles/fonts'

interface EnvironmentProps {
  key: string
  title: string
}

interface PlantsProps {
  id: number
  name: string
  about: string
  water_tips: string
  photo: string
  environments: string[]
  frequency: {
    times: number
    repeat_every: string
  }
}

export function PlantSelect() {
  const [environments, setEnvironments] = useState<EnvironmentProps[]>([])
  const [plants, setPlants] = useState<PlantsProps[]>([])
  const [filteredPlants, setFilteredPlants] = useState<PlantsProps[]>([])
  const [environmentSelected, setEnvironmentSelected] = useState('all')
  const [loading, setLoading] = useState(true)

  function handleEnvironmentSelected(environment: string) {
    setEnvironmentSelected(environment)

    if (environment === 'all') return setFilteredPlants(plants)

    const filtered = plants.filter((plant) =>
      plant.environments.includes(environment)
    )

    setFilteredPlants(filtered)
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
    async function fetchPlants() {
      const { data } = await api.get<PlantsProps[]>(
        'plants?_sort=name&_order=asc'
      )
      setPlants(data)
      setFilteredPlants(data)
      setLoading(false)
    }

    fetchPlants()

    return () => {
      setPlants([])
    }
  }, [])

  useEffect(() => {
    console.log(environmentSelected)
  }, [environmentSelected])

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
            <PlantCardPrimary key={item.id} data={item} />
          )}
          showsVerticalScrollIndicator={false}
          numColumns={2}
          keyExtractor={(item) => item.id.toString()}
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
