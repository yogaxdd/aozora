import axios from 'axios'

// Base API configuration
const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'https://www.sankavollerei.com'

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
})

// API response types based on Samehadaku API
export interface AnimeItem {
  id?: string
  animeId: string
  title: string
  poster: string
  episodes?: string
  score?: string
  status?: string
  type?: string
  releaseDate?: string
  releasedOn?: string
  totalEpisodes?: number
  genreList?: Array<{
    title: string
    genreId: string
    href: string
    samehadakuUrl: string
  }>
  href: string
  samehadakuUrl: string
}

export interface Genre {
  title: string
  genreId: string
  href: string
  samehadakuUrl: string
}

export interface BatchItem {
  title: string
  poster: string
  type: string
  score: string
  status: string
  batchId: string
  href: string
  samehadakuUrl: string
  genreList: Genre[]
}

export interface AnimeDetail {
  title: string
  poster: string
  score: {
    value: string
    users: string
  }
  japanese: string
  synonyms: string
  english: string
  status: string
  type: string
  source: string
  duration: string
  episodes: number | null
  season: string
  studios: string
  producers: string
  aired: string
  trailer: string
  synopsis: {
    paragraphs: string[]
    connections: any[]
  }
  genreList: Genre[]
  batchList: Array<{
    title: string
    batchId: string
    href: string
    samehadakuUrl: string
  }>
  episodeList: Array<{
    title: number | string
    episodeId: string
    href: string
    samehadakuUrl: string
  }>
}

export interface BatchDetail {
  title: string
  animeId: string
  poster: string
  japanese: string
  synonyms: string
  english: string
  status: string
  type: string
  source: string
  score: string
  duration: string
  episodes: number
  season: string
  studios: string
  producers: string
  aired: string
  releasedOn: string
  synopsis: {
    paragraphs: string[]
    connections: Array<{
      title: string
      animeId: string
      href: string
      samehadakuUrl: string
    }>
  }
  genreList: Genre[]
  downloadUrl: {
    formats: Array<{
      title: string
      qualities: Array<{
        title: string
        urls: Array<{
          title: string
          url: string
        }>
      }>
    }>
  }
  recommendedAnimeList: AnimeItem[]
}

export interface ServerLink {
  serverId: string
  serverName: string
  embedUrl: string
  directUrl: string
  quality: string
  size: string
}

export interface TopAnimeItem extends AnimeItem {
  rank: number
}

export interface ApiResponse<T> {
  creator: string
  message: string
  data: T
  pagination?: {
    currentPage: number
    totalPages: number
    hasNextPage: boolean
    hasPrevPage: boolean
    nextPage: number | null
    prevPage: number | null
  }
}

export interface PaginatedResponse<T> {
  data: T[]
  pagination: {
    currentPage: number
    totalPages: number
    hasNext: boolean
    hasPrev: boolean
  }
}

export interface HomeData {
  recent: {
    href: string
    samehadakuUrl: string
    animeList: AnimeItem[]
  }
  batch: {
    href: string
    samehadakuUrl: string
    batchList: any[]
  }
  movie: {
    href: string
    samehadakuUrl: string
    animeList: AnimeItem[]
  }
  top10: {
    href: string
    samehadakuUrl: string
    animeList: TopAnimeItem[]
  }
}

// API endpoints
export const apiEndpoints = {
  home: '/anime/home',
  schedule: '/anime/schedule',
  ongoing: '/anime/ongoing-anime',
  completed: '/anime/complete-anime',
  genres: '/anime/genre',
  search: (query: string) => `/anime/search/${encodeURIComponent(query)}`,
  animeDetail: (slug: string) => `/anime/anime/${slug}`,
  episodeDetail: (slug: string) => `/anime/episode/${slug}`,
  batchDetail: (slug: string) => `/anime/batch/${slug}`,
  genreAnime: (slug: string, page: number = 1) => `/anime/genre/${slug}?page=${page}`,
  completedPage: (page: number) => `/anime/complete-anime/${page}`
}

// API functions
export const fetchHome = async (): Promise<HomeData> => {
  try {
    const response = await api.get(apiEndpoints.home)
    return response.data.data
  } catch (error) {
    console.error('Error fetching home data:', error)
    // Return mock data for development
    return {
      recent: { href: '', samehadakuUrl: '', animeList: [] },
      batch: { href: '', samehadakuUrl: '', batchList: [] },
      movie: { href: '', samehadakuUrl: '', animeList: [] },
      top10: { href: '', samehadakuUrl: '', animeList: [] }
    }
  }
}

export const fetchRecentAnime = async (page: number = 1): Promise<ApiResponse<{ animeList: AnimeItem[] }>> => {
  try {
    const response = await api.get(`${apiEndpoints.ongoing}?page=${page}`)
    return {
      creator: response.data.creator || '',
      message: '',
      data: { animeList: response.data.data.ongoingAnimeData.map((item: any) => ({
        id: item.slug,
        animeId: item.slug,
        title: item.title,
        poster: item.poster,
        episodes: item.current_episode,
        status: 'Ongoing',
        type: 'TV',
        releasedOn: item.newest_release_date,
        href: `/anime/${item.slug}`,
        samehadakuUrl: item.otakudesu_url
      })) },
      pagination: {
        currentPage: response.data.data.paginationData?.current_page || 1,
        hasPrevPage: response.data.data.paginationData?.has_previous_page || false,
        prevPage: response.data.data.paginationData?.previous_page || null,
        hasNextPage: response.data.data.paginationData?.has_next_page || false,
        nextPage: response.data.data.paginationData?.next_page || null,
        totalPages: response.data.data.paginationData?.last_visible_page || 1
      }
    }
  } catch (error) {
    console.error('Error fetching recent anime:', error)
    return {
      creator: '',
      message: '',
      data: { animeList: [] },
      pagination: {
        currentPage: 1,
        hasPrevPage: false,
        prevPage: null,
        hasNextPage: false,
        nextPage: null,
        totalPages: 1
      }
    }
  }
}

// Alias for latest anime (same as recent)
export const fetchLatestAnime = fetchRecentAnime

export const fetchPopularAnime = async (page: number = 1): Promise<PaginatedResponse<AnimeItem>> => {
  try {
    const response = await api.get(`${apiEndpoints.completed}?page=${page}`)
    return {
      data: response.data.data.completeAnimeData?.map((item: any) => ({
        id: item.slug,
        animeId: item.slug,
        title: item.title,
        poster: item.poster,
        episodes: item.episode_count,
        score: item.rating,
        status: 'Completed',
        type: 'TV',
        releasedOn: item.last_release_date,
        href: `/anime/${item.slug}`,
        samehadakuUrl: item.otakudesu_url
      })) || [],
      pagination: {
        currentPage: response.data.data.paginationData?.current_page || 1,
        totalPages: response.data.data.paginationData?.last_visible_page || 1,
        hasNext: response.data.data.paginationData?.has_next_page || false,
        hasPrev: response.data.data.paginationData?.has_previous_page || false
      }
    }
  } catch (error) {
    console.error('Error fetching popular anime:', error)
    return {
      data: [
        {
          id: 'popular-1',
          title: 'Attack on Titan',
          animeId: 'attack-on-titan',
          poster: 'https://via.placeholder.com/300x400',
          href: '/anime/attack-on-titan',
          samehadakuUrl: '#',
          score: '9.0',
          type: 'TV',
          status: 'Completed',
          totalEpisodes: 87,
          genreList: [
            { title: 'Action', genreId: 'action', href: '/genres/action', samehadakuUrl: '#' },
            { title: 'Drama', genreId: 'drama', href: '/genres/drama', samehadakuUrl: '#' }
          ],
          releasedOn: '2 years ago'
        }
      ],
      pagination: {
        currentPage: 1,
        totalPages: 1,
        hasNext: false,
        hasPrev: false
      }
    }
  }
}

export const fetchMovies = async (page: number = 1): Promise<ApiResponse<{ animeList: AnimeItem[] }>> => {
  try {
    const response = await api.get(`${apiEndpoints.completedPage(page)}`)
    return {
      creator: response.data.creator || '',
      message: '',
      data: { animeList: response.data.data.completeAnimeData?.map((item: any) => ({
        id: item.slug,
        animeId: item.slug,
        title: item.title,
        poster: item.poster,
        episodes: item.episode_count,
        score: item.rating,
        status: 'Completed',
        type: 'Movie',
        releasedOn: item.last_release_date,
        href: `/anime/${item.slug}`,
        samehadakuUrl: item.otakudesu_url
      })) || [] },
      pagination: {
        currentPage: response.data.data.paginationData?.current_page || 1,
        hasPrevPage: response.data.data.paginationData?.has_previous_page || false,
        prevPage: response.data.data.paginationData?.previous_page || null,
        hasNextPage: response.data.data.paginationData?.has_next_page || false,
        nextPage: response.data.data.paginationData?.next_page || null,
        totalPages: response.data.data.paginationData?.last_visible_page || 1
      }
    }
  } catch (error) {
    console.error('Error fetching movies:', error)
    return {
      creator: '',
      message: '',
      data: { animeList: [] },
      pagination: {
        currentPage: 1,
        hasPrevPage: false,
        prevPage: null,
        hasNextPage: false,
        nextPage: null,
        totalPages: 1
      }
    }
  }
}

export const fetchOngoingAnime = async (page: number = 1): Promise<ApiResponse<{ animeList: AnimeItem[] }>> => {
  try {
    const response = await api.get(`${apiEndpoints.ongoing}?page=${page}`)
    return response.data
  } catch (error) {
    console.error('Error fetching ongoing anime:', error)
    return {
      creator: '',
      message: '',
      data: { animeList: [] },
      pagination: {
        currentPage: 1,
        hasPrevPage: false,
        prevPage: null,
        hasNextPage: false,
        nextPage: null,
        totalPages: 1
      }
    }
  }
}

export const fetchCompletedAnime = async (page: number = 1): Promise<ApiResponse<{ animeList: AnimeItem[] }>> => {
  try {
    const response = await api.get(`${apiEndpoints.completed}?page=${page}`)
    return response.data
  } catch (error) {
    console.error('Error fetching completed anime:', error)
    return {
      creator: '',
      message: '',
      data: { animeList: [] },
      pagination: {
        currentPage: 1,
        hasPrevPage: false,
        prevPage: null,
        hasNextPage: false,
        nextPage: null,
        totalPages: 1
      }
    }
  }
}

export const fetchMovieAnime = async (page: number = 1): Promise<ApiResponse<{ animeList: AnimeItem[] }>> => {
  try {
    const response = await api.get(`${apiEndpoints.movies}?page=${page}`)
    return response.data
  } catch (error) {
    console.error('Error fetching movie anime:', error)
    return {
      creator: '',
      message: '',
      data: { animeList: [] },
      pagination: {
        currentPage: 1,
        hasPrevPage: false,
        prevPage: null,
        hasNextPage: false,
        nextPage: null,
        totalPages: 1
      }
    }
  }
}

export const searchAnime = async (query: string, page: number = 1): Promise<ApiResponse<{ animeList: AnimeItem[] }>> => {
  try {
    const response = await api.get(`${apiEndpoints.search(query)}&page=${page}`)
    return response.data
  } catch (error) {
    console.error('Error searching anime:', error)
    return {
      creator: '',
      message: '',
      data: { animeList: [] },
      pagination: {
        currentPage: 1,
        hasPrevPage: false,
        prevPage: null,
        hasNextPage: false,
        nextPage: null,
        totalPages: 1
      }
    }
  }
}

export const fetchAllAnime = async (): Promise<ApiResponse<{ list: { startWith: string; animeList: { title: string; animeId: string; href: string; samehadakuUrl: string }[] }[] }>> => {
  try {
    const response = await api.get(apiEndpoints.list)
    return response.data
  } catch (error) {
    console.error('Error fetching all anime:', error)
    return {
      creator: '',
      message: '',
      data: { list: [] },
      pagination: undefined
    }
  }
}

export const fetchGenres = async (): Promise<Genre[]> => {
  try {
    const response = await api.get(apiEndpoints.genres)
    return response.data.data?.map((genre: any) => ({
      title: genre.name,
      genreId: genre.slug,
      href: `/genres/${genre.slug}`,
      samehadakuUrl: genre.otakudesu_url
    })) || []
  } catch (error) {
    console.error('Error fetching genres:', error)
    return [
      { title: 'Action', genreId: 'action', href: '/genres/action', samehadakuUrl: '#' },
      { title: 'Adventure', genreId: 'adventure', href: '/genres/adventure', samehadakuUrl: '#' },
      { title: 'Comedy', genreId: 'comedy', href: '/genres/comedy', samehadakuUrl: '#' },
      { title: 'Drama', genreId: 'drama', href: '/genres/drama', samehadakuUrl: '#' },
      { title: 'Fantasy', genreId: 'fantasy', href: '/genres/fantasy', samehadakuUrl: '#' },
      { title: 'Romance', genreId: 'romance', href: '/genres/romance', samehadakuUrl: '#' },
      { title: 'Sci-Fi', genreId: 'sci-fi', href: '/genres/sci-fi', samehadakuUrl: '#' },
      { title: 'Slice of Life', genreId: 'slice-of-life', href: '/genres/slice-of-life', samehadakuUrl: '#' }
    ]
  }
}

export const fetchAnimeByGenre = async (genreSlug: string, page: number = 1): Promise<ApiResponse<{ animeList: AnimeItem[] }>> => {
  try {
    const response = await api.get(apiEndpoints.genreAnime(genreSlug, page))
    return {
      creator: response.data.creator || '',
      message: '',
      data: { animeList: response.data.data.anime?.map((item: any) => ({
        id: item.slug,
        animeId: item.slug,
        title: item.title,
        poster: item.poster,
        episodes: item.episode_count,
        score: item.rating,
        status: 'Unknown',
        type: 'TV',
        releasedOn: item.season,
        href: `/anime/${item.slug}`,
        samehadakuUrl: item.otakudesu_url,
        genreList: item.genres?.map((genre: any) => ({
          title: genre.name,
          genreId: genre.slug,
          href: `/genres/${genre.slug}`,
          samehadakuUrl: genre.otakudesu_url
        })) || []
      })) || [] },
      pagination: {
        currentPage: response.data.data.pagination?.current_page || 1,
        hasPrevPage: response.data.data.pagination?.has_previous_page || false,
        prevPage: response.data.data.pagination?.previous_page || null,
        hasNextPage: response.data.data.pagination?.has_next_page || false,
        nextPage: response.data.data.pagination?.next_page || null,
        totalPages: response.data.data.pagination?.last_visible_page || 1
      }
    }
  } catch (error) {
    console.error('Error fetching anime by genre:', error)
    return {
      creator: '',
      message: '',
      data: { animeList: [] },
      pagination: {
        currentPage: 1,
        hasPrevPage: false,
        prevPage: null,
        hasNextPage: false,
        nextPage: null,
        totalPages: 1
      }
    }
  }
}

export const fetchBatchAnime = async (page: number = 1): Promise<ApiResponse<{ batchList: BatchItem[] }>> => {
  try {
    const response = await api.get(`${apiEndpoints.completedPage(page)}`)
    return {
      creator: response.data.creator || '',
      message: '',
      data: { batchList: response.data.data.completeAnimeData?.map((item: any) => ({
        title: item.title,
        poster: item.poster,
        type: 'TV',
        score: item.rating,
        status: 'Completed',
        batchId: item.slug,
        href: `/batch/${item.slug}`,
        samehadakuUrl: item.otakudesu_url,
        genreList: []
      })) || [] },
      pagination: {
        currentPage: response.data.data.paginationData?.current_page || 1,
        hasPrevPage: response.data.data.paginationData?.has_previous_page || false,
        prevPage: response.data.data.paginationData?.previous_page || null,
        hasNextPage: response.data.data.paginationData?.has_next_page || false,
        nextPage: response.data.data.paginationData?.next_page || null,
        totalPages: response.data.data.paginationData?.last_visible_page || 1
      }
    }
  } catch (error) {
    console.error('Error fetching batch anime:', error)
    return {
      creator: '',
      message: '',
      data: { batchList: [] },
      pagination: {
        currentPage: 1,
        hasPrevPage: false,
        prevPage: null,
        hasNextPage: false,
        nextPage: null,
        totalPages: 1
      }
    }
  }
}

export const fetchAnimeDetail = async (animeSlug: string): Promise<ApiResponse<AnimeDetail>> => {
  try {
    const response = await api.get(apiEndpoints.animeDetail(animeSlug))
    const data = response.data.data
    return {
      creator: response.data.creator || '',
      message: '',
      data: {
        title: data.title,
        poster: data.poster,
        score: { value: data.rating || '0', users: '0' },
        japanese: data.japanese_title || '',
        synonyms: '',
        english: data.title,
        status: data.status || 'Unknown',
        type: data.type || 'TV',
        source: 'Unknown',
        duration: data.duration || '24 min',
        episodes: parseInt(data.episode_count) || 0,
        season: data.release_date || 'Unknown',
        studios: data.studio || 'Unknown',
        producers: data.produser || 'Unknown',
        aired: data.release_date || 'Unknown',
        trailer: '',
        synopsis: { 
          paragraphs: data.synopsis ? [data.synopsis] : ['No synopsis available'], 
          connections: [] 
        },
        genreList: data.genres?.map((genre: any) => ({
          title: genre.name,
          genreId: genre.slug,
          href: `/genres/${genre.slug}`,
          samehadakuUrl: genre.otakudesu_url
        })) || [],
        batchList: data.batch ? [{
          title: data.batch.title || 'Batch Download',
          batchId: animeSlug + '-batch',
          href: `/batch/${animeSlug}`,
          samehadakuUrl: '#'
        }] : [],
        episodeList: data.episode_lists?.map((ep: any) => ({
          title: ep.episode_number.toString(),
          episodeId: ep.slug,
          href: `/episode/${ep.slug}`,
          samehadakuUrl: ep.otakudesu_url
        })) || []
      },
      pagination: undefined
    }
  } catch (error) {
    console.error('Error fetching anime detail:', error)
    return {
      creator: '',
      message: '',
      data: {
        title: 'Sample Anime Title',
        poster: 'https://via.placeholder.com/300x400',
        score: { value: '8.5', users: '1000' },
        japanese: 'サンプルアニメ',
        synonyms: '',
        english: 'Sample Anime',
        status: 'Ongoing',
        type: 'TV',
        source: 'Manga',
        duration: '24 min per ep',
        episodes: 12,
        season: 'Fall 2024',
        studios: 'Sample Studio',
        producers: 'Sample Producer',
        aired: 'Oct 2024',
        trailer: '',
        synopsis: { 
          paragraphs: ['This is a sample anime description for testing purposes.'], 
          connections: [] 
        },
        genreList: [
          { title: 'Action', genreId: 'action', href: '/genres/action', samehadakuUrl: '#' },
          { title: 'Adventure', genreId: 'adventure', href: '/genres/adventure', samehadakuUrl: '#' }
        ],
        batchList: [],
        episodeList: [
          { title: '1', episodeId: 'ep1', href: '/episode/ep1', samehadakuUrl: '#' },
          { title: '2', episodeId: 'ep2', href: '/episode/ep2', samehadakuUrl: '#' }
        ]
      },
      pagination: undefined
    }
  }
}

export const fetchBatchDetail = async (batchId: string): Promise<ApiResponse<BatchDetail>> => {
  try {
    const response = await api.get(apiEndpoints.batchDetail(batchId))
    return response.data
  } catch (error) {
    console.error('Error fetching batch detail:', error)
    return {
      creator: '',
      message: '',
      data: {
        title: 'Sample Anime Title',
        animeId: batchId,
        poster: 'https://via.placeholder.com/300x400',
        japanese: 'サンプルアニメ',
        synonyms: '',
        english: 'Sample Anime',
        status: 'Ongoing',
        type: 'TV',
        source: 'Manga',
        score: '8.5',
        duration: '24 min per ep',
        episodes: 12,
        season: 'Fall 2024',
        studios: 'Sample Studio',
        producers: 'Sample Producer',
        aired: 'Oct 2024',
        releasedOn: '1 month ago',
        synopsis: { 
          paragraphs: ['This is a sample anime description for testing purposes.'], 
          connections: [] 
        },
        genreList: [
          { title: 'Action', genreId: 'action', href: '/genres/action', samehadakuUrl: '#' },
          { title: 'Adventure', genreId: 'adventure', href: '/genres/adventure', samehadakuUrl: '#' }
        ],
        downloadUrl: { formats: [] },
        recommendedAnimeList: []
      },
      pagination: undefined
    }
  }
}

export const fetchServerLink = async (serverId: string): Promise<ApiResponse<ServerLink>> => {
  try {
    return {
      creator: 'Sanka Vollerei',
      message: '',
      data: {
        serverId: serverId,
        serverName: 'Sample Server',
        embedUrl: 'https://example.com/embed/sample',
        directUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
        quality: '1080p',
        size: '500MB'
      },
      pagination: undefined
    }
  } catch (error) {
    console.error('Error fetching server link:', error)
    return {
      creator: '',
      message: '',
      data: {
        serverId: serverId,
        serverName: 'Sample Server',
        embedUrl: 'https://example.com/embed/sample',
        directUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
        quality: '1080p',
        size: '500MB'
      },
      pagination: undefined
    }
  }
}

// Fetch anime episode list
export const fetchAnimeEpisodes = async (animeSlug: string): Promise<Array<{
  slug: string
  title: string
  number: number
  downloadUrl?: string
}>> => {
  try {
    const response = await api.get(apiEndpoints.animeDetail(animeSlug))
    const data = response.data.data
    
    // Extract episodes from API response
    const episodes = data.episode_list?.map((ep: any, index: number) => ({
      slug: ep.slug || `${animeSlug}-episode-${index + 1}-sub-indo`,
      title: ep.title || `Episode ${index + 1}`,
      number: index + 1,
      downloadUrl: ep.download_url
    })) || []
    
    return episodes
  } catch (error) {
    console.error('Error fetching anime episodes:', error)
    // Fallback: generate episodes based on common pattern
    return Array.from({ length: 12 }, (_, i) => ({
      slug: `${animeSlug}-episode-${i + 1}-sub-indo`,
      title: `Episode ${i + 1}`,
      number: i + 1
    }))
  }
}

export const fetchEpisodeDetail = async (episodeSlug: string): Promise<{
  id: string
  title: string
  animeTitle: string
  animeSlug: string
  number: number
  downloadUrl?: string
  servers: Array<{
    name: string
    url: string
    quality: string
  }>
}> => {
  try {
    const response = await api.get(apiEndpoints.episodeDetail(episodeSlug))
    const data = response.data.data
    
    // Extract episode number from slug or title
    const episodeMatch = episodeSlug.match(/-episode-(\d+)-/) || data.episode?.match(/(\d+)/)
    const episodeNumber = episodeMatch ? parseInt(episodeMatch[1]) : 1
    
    // Clean anime title from slug
    const animeSlug = episodeSlug.replace(/-episode-\d+.*$/, '')
    
    // Map common anime slugs to proper titles
    const animeSlugToTitle: { [key: string]: string } = {
      'khwrs': 'Kaoru Hana wa Rin to Saku',
      'bnha': 'Boku no Hero Academia',
      'op': 'One Piece',
      'aot': 'Attack on Titan',
      'ds': 'Demon Slayer',
      'jjk': 'Jujutsu Kaisen'
    }
    
    const cleanAnimeTitle = data.anime?.title || 
                           animeSlugToTitle[animeSlug] ||
                           animeSlug.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase()) ||
                           'Anime Title'
    
    return {
      id: episodeSlug,
      title: data.episode || `Episode ${episodeNumber}`,
      animeTitle: cleanAnimeTitle,
      animeSlug: animeSlug,
      number: episodeNumber,
      downloadUrl: data.download_url,
      servers: data.stream_servers?.qualities?.flatMap((quality: any) => 
        quality.serverList?.map((server: any) => ({
          name: server.title,
          url: server.url || data.stream_url || 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
          quality: quality.title
        }))
      ) || [
        { name: 'Streamtape', url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4', quality: '1080p' },
        { name: 'Mixdrop', url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4', quality: '720p' },
        { name: 'Upstream', url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4', quality: '480p' }
      ]
    }
  } catch (error) {
    console.error('Error fetching episode detail:', error)
    
    // Extract info from slug for fallback
    const episodeMatch = episodeSlug.match(/-episode-(\d+)-/) 
    const episodeNumber = episodeMatch ? parseInt(episodeMatch[1]) : 1
    const animeSlug = episodeSlug.replace(/-episode-\d+.*$/, '')
    
    // Map common anime slugs to proper titles
    const animeSlugToTitle: { [key: string]: string } = {
      'khwrs': 'Kaoru Hana wa Rin to Saku',
      'bnha': 'Boku no Hero Academia',
      'op': 'One Piece',
      'aot': 'Attack on Titan',
      'ds': 'Demon Slayer',
      'jjk': 'Jujutsu Kaisen'
    }
    
    const cleanAnimeTitle = animeSlugToTitle[animeSlug] ||
                           animeSlug.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase())
    
    return {
      id: episodeSlug,
      title: `Episode ${episodeNumber}`,
      animeTitle: cleanAnimeTitle || 'Anime Title',
      animeSlug: animeSlug,
      number: episodeNumber,
      downloadUrl: undefined,
      servers: [
        { name: 'Streamtape', url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4', quality: '1080p' },
        { name: 'Mixdrop', url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4', quality: '720p' },
        { name: 'Upstream', url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4', quality: '480p' }
      ]
    }
  }
}

export default api
