// IndexedDB utilities for offline storage

// Type definitions
interface ArticleSource {
  name: string
  url?: string
}

interface Article {
  id?: string
  title: string
  description?: string
  content?: string
  url: string
  urlToImage?: string
  publishedAt: string
  source: ArticleSource
  author?: string
  category?: string
}

interface PayoutRate {
  id: string
  source: string
  author?: string
  rate: number
  currency: string
  lastUpdated: string
}

interface UserPreference {
  key: string
  value: unknown
}

class StorageManager {
  private dbName = "NewsDB"
  private version = 1
  private db: IDBDatabase | null = null

  async init(): Promise<void> {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(this.dbName, this.version)

      request.onerror = () => reject(request.error)
      request.onsuccess = () => {
        this.db = request.result
        resolve()
      }

      request.onupgradeneeded = (event) => {
        const db = (event.target as IDBOpenDBRequest).result

        // Articles store
        if (!db.objectStoreNames.contains("articles")) {
          const articlesStore = db.createObjectStore("articles", { keyPath: "id" })
          articlesStore.createIndex("publishedAt", "publishedAt")
          articlesStore.createIndex("source", "source.name")
          articlesStore.createIndex("author", "author")
        }

        // Payout rates store
        if (!db.objectStoreNames.contains("payoutRates")) {
          const payoutStore = db.createObjectStore("payoutRates", { keyPath: "id" })
          payoutStore.createIndex("source", "source")
          payoutStore.createIndex("author", "author")
        }

        // User preferences store
        if (!db.objectStoreNames.contains("preferences")) {
          db.createObjectStore("preferences", { keyPath: "key" })
        }
      }
    })
  }

  async saveArticles(articles: Article[]): Promise<void> {
    if (!this.db) await this.init()

    const transaction = this.db!.transaction(["articles"], "readwrite")
    const store = transaction.objectStore("articles")

    for (const article of articles) {
      await store.put({ ...article, id: article.id || this.generateId() })
    }
  }

  async getArticles(): Promise<Article[]> {
    if (!this.db) await this.init()

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction(["articles"], "readonly")
      const store = transaction.objectStore("articles")
      const request = store.getAll()

      request.onsuccess = () => resolve(request.result as Article[])
      request.onerror = () => reject(request.error)
    })
  }

  async savePayoutRates(rates: PayoutRate[]): Promise<void> {
    if (!this.db) await this.init()

    const transaction = this.db!.transaction(["payoutRates"], "readwrite")
    const store = transaction.objectStore("payoutRates")

    for (const rate of rates) {
      await store.put(rate)
    }
  }

  async getPayoutRates(): Promise<PayoutRate[]> {
    if (!this.db) await this.init()

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction(["payoutRates"], "readonly")
      const store = transaction.objectStore("payoutRates")
      const request = store.getAll()

      request.onsuccess = () => resolve(request.result as PayoutRate[])
      request.onerror = () => reject(request.error)
    })
  }

  async savePreference(key: string, value: unknown): Promise<void> {
    if (!this.db) await this.init()

    const transaction = this.db!.transaction(["preferences"], "readwrite")
    const store = transaction.objectStore("preferences")
    await store.put({ key, value })
  }

  async getPreference<T>(key: string): Promise<T | null> {
    if (!this.db) await this.init()

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction(["preferences"], "readonly")
      const store = transaction.objectStore("preferences")
      const request = store.get(key)

      request.onsuccess = () => {
        const result = request.result as UserPreference | undefined
        resolve(result ? (result.value as T) : null)
      }
      request.onerror = () => reject(request.error)
    })
  }

  async clearArticles(): Promise<void> {
    if (!this.db) await this.init()

    const transaction = this.db!.transaction(["articles"], "readwrite")
    const store = transaction.objectStore("articles")
    await store.clear()
  }

  async getArticlesBySource(sourceName: string): Promise<Article[]> {
    if (!this.db) await this.init()

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction(["articles"], "readonly")
      const store = transaction.objectStore("articles")
      const index = store.index("source")
      const request = index.getAll(sourceName)

      request.onsuccess = () => resolve(request.result as Article[])
      request.onerror = () => reject(request.error)
    })
  }

  async getArticlesByDateRange(startDate: string, endDate: string): Promise<Article[]> {
    if (!this.db) await this.init()

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction(["articles"], "readonly")
      const store = transaction.objectStore("articles")
      const index = store.index("publishedAt")
      const range = IDBKeyRange.bound(startDate, endDate)
      const request = index.getAll(range)

      request.onsuccess = () => resolve(request.result as Article[])
      request.onerror = () => reject(request.error)
    })
  }

  private generateId(): string {
    return Math.random().toString(36).substr(2, 9)
  }
}

export const storageManager = new StorageManager()
export type { Article, PayoutRate, ArticleSource, UserPreference }