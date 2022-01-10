import gql from 'graphql-tag'

export const getAxieBriefList = async(context, owner) => {
    const convertedRonin = owner
    const apollo = this.app.apolloProvider.defaultClient
    const query = gql`
      query GetAxieBriefList(
        $auctionType: AuctionType
        $criteria: AxieSearchCriteria
        $from: Int
        $sort: SortBy
        $size: Int
        $owner: String
      ) {
        axies(
          auctionType: $auctionType
          criteria: $criteria
          from: $from
          sort: $sort
          size: $size
          owner: $owner
        ) {
          total
          results {
            ...AxieBrief
            __typename
          }
          __typename
        }
      }

      fragment AxieBrief on Axie {
        id
        name
        stage
        class
        breedCount
        image
        title
        genes
        battleInfo {
          banned
          __typename
        }
        auction {
          currentPrice
          currentPriceUSD
          __typename
        }
        stats {
          ...AxieStats
          __typename
        }
        parts {
          id
          name
          class
          type
          specialGenes
          __typename
        }
        __typename
      }

      fragment AxieStats on AxieStats {
        hp
        speed
        skill
        morale
        __typename
      }
    `
    const variables = {
      auctionType: 'All',
      criteria: {
        classes: [],
        parts: [],
        hp: null,
        speed: null,
        skill: null,
        morale: null,
        breedCount: null,
        pureness: [],
        numMystic: [],
        title: null,
        region: null,
        stages: [3, 4]
      },
      from: 0,
      size: 12,
      sort: 'PriceAsc',
      owner: convertedRonin
    }
    try {
        const result = await apollo.query({ query, variables })
        return result && result.data && result.data.axies.results
      } catch (error) {
        // eslint-disable-next-line no-console
        console.log(error)
        return false
      }
}