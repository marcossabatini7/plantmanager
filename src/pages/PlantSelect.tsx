import React, { useEffect, useState } from 'react'
import { View, Text, StyleSheet, FlatList } from 'react-native'
import { EnvironmentButton } from '../components/EnvironmentButton'

import { Header } from '../components/Header'
import { PlantCardPrimary } from '../components/PlantCardPrimary'
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

  useEffect(() => {
    async function fetchEnvironment() {
      const { data } = await api.get<EnvironmentProps[]>('plants_environments')
      setEnvironments([{ key: 'all', title: 'Todos' }, ...data])
    }

    fetchEnvironment()

    return () => {
      setEnvironments([])
    }
  }, [])

  useEffect(() => {
    async function fetchPlants() {
      const { data } = await api.get<PlantsProps[]>('plants')
      setPlants(data)
    }

    fetchPlants()

    return () => {
      setPlants([])
    }
  }, [])

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
            <EnvironmentButton key={item.key} title={item.title} />
          )}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.environmentList}
          keyExtractor={(item) => item.key.toString()}
        ></FlatList>
      </View>

      <View style={styles.plants}>
        <FlatList
          data={plants}
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
