import { 
  PutCommand, 
  GetCommand, 
  QueryCommand, 
  UpdateCommand, 
  DeleteCommand,
  ScanCommand 
} from '@aws-sdk/lib-dynamodb'
import { dynamoClient, TABLES } from './dynamodb-server'
import { 
  WebsiteContent,
  BlogPost, 
  Event, 
  Gallery, 
  GalleryImage, 
  Contact, 
  Registration,
  DynamoDBItem 
} from '../types/dynamodb'

// Firebase authentication is now handled separately

// Helper function to create DynamoDB item
function createDynamoDBItem<T>(
  tableName: string,
  item: T,
  pk: string,
  sk: string,
  gsi1pk?: string,
  gsi1sk?: string
): DynamoDBItem<T> {
  return {
    PK: pk,
    SK: sk,
    data: item,
    GSI1PK: gsi1pk,
    GSI1SK: gsi1sk,
  }
}

// Website content operations
export const websiteContentOperations = {
  async create(content: WebsiteContent): Promise<void> {
    const item = createDynamoDBItem(
      TABLES.WEBSITE_CONTENT,
      content,
      `SECTION#${content.section}`,
      `CONTENT#${content.id}`,
      `ACTIVE#${content.isActive}`,
      `ORDER#${content.order}`
    )
    
    await dynamoClient.send(new PutCommand({
      TableName: TABLES.WEBSITE_CONTENT,
      Item: item,
    }))
  },

  async getBySection(section: string): Promise<WebsiteContent[]> {
    const result = await dynamoClient.send(new QueryCommand({
      TableName: TABLES.WEBSITE_CONTENT,
      KeyConditionExpression: 'PK = :pk',
      ExpressionAttributeValues: {
        ':pk': `SECTION#${section}`,
      },
    }))

    return result.Items?.map(item => item.data as WebsiteContent) || []
  },

  async getActiveContent(): Promise<WebsiteContent[]> {
    const result = await dynamoClient.send(new ScanCommand({
      TableName: TABLES.WEBSITE_CONTENT,
      FilterExpression: 'data.isActive = :isActive',
      ExpressionAttributeValues: {
        ':isActive': true,
      },
    }))

    return result.Items?.map(item => item.data as WebsiteContent) || []
  },

  async update(id: string, updates: Partial<WebsiteContent>): Promise<void> {
    const updateExpression = Object.keys(updates)
      .map(key => `data.${key} = :${key}`)
      .join(', ')
    
    const expressionAttributeValues = Object.entries(updates).reduce(
      (acc, [key, value]) => ({ ...acc, [`:${key}`]: value }),
      {}
    )

    await dynamoClient.send(new UpdateCommand({
      TableName: TABLES.WEBSITE_CONTENT,
      Key: {
        PK: `SECTION#${updates.section || 'unknown'}`,
        SK: `CONTENT#${id}`,
      },
      UpdateExpression: `SET ${updateExpression}, data.updatedAt = :updatedAt`,
      ExpressionAttributeValues: {
        ...expressionAttributeValues,
        ':updatedAt': new Date().toISOString(),
      },
    }))
  },

  async delete(id: string, section: string): Promise<void> {
    await dynamoClient.send(new DeleteCommand({
      TableName: TABLES.WEBSITE_CONTENT,
      Key: {
        PK: `SECTION#${section}`,
        SK: `CONTENT#${id}`,
      },
    }))
  },
}

// Blog post operations
export const blogPostOperations = {
  async create(post: BlogPost): Promise<void> {
    const item = createDynamoDBItem(
      TABLES.BLOG_POSTS,
      post,
      `BLOG#${post.id}`,
      `POST#${post.slug}`,
      `AUTHOR#${post.authorName}`,
      `POST#${post.createdAt}`
    )
    
    await dynamoClient.send(new PutCommand({
      TableName: TABLES.BLOG_POSTS,
      Item: item,
    }))
  },

  async getBySlug(slug: string): Promise<BlogPost | null> {
    const result = await dynamoClient.send(new QueryCommand({
      TableName: TABLES.BLOG_POSTS,
      KeyConditionExpression: 'PK = :pk',
      ExpressionAttributeValues: {
        ':pk': `POST#${slug}`,
      },
    }))

    return result.Items?.[0]?.data as BlogPost || null
  },

  async getPublished(): Promise<BlogPost[]> {
    const result = await dynamoClient.send(new ScanCommand({
      TableName: TABLES.BLOG_POSTS,
      FilterExpression: 'data.published = :published',
      ExpressionAttributeValues: {
        ':published': true,
      },
    }))

    return result.Items?.map(item => item.data as BlogPost) || []
  },

  async update(id: string, updates: Partial<BlogPost>): Promise<void> {
    const updateExpression = Object.keys(updates)
      .map(key => `data.${key} = :${key}`)
      .join(', ')
    
    const expressionAttributeValues = Object.entries(updates).reduce(
      (acc, [key, value]) => ({ ...acc, [`:${key}`]: value }),
      {}
    )

    await dynamoClient.send(new UpdateCommand({
      TableName: TABLES.BLOG_POSTS,
      Key: {
        PK: `BLOG#${id}`,
        SK: `POST#${id}`,
      },
      UpdateExpression: `SET ${updateExpression}, data.updatedAt = :updatedAt`,
      ExpressionAttributeValues: {
        ...expressionAttributeValues,
        ':updatedAt': new Date().toISOString(),
      },
    }))
  },

  async delete(id: string): Promise<void> {
    await dynamoClient.send(new DeleteCommand({
      TableName: TABLES.BLOG_POSTS,
      Key: {
        PK: `BLOG#${id}`,
        SK: `POST#${id}`,
      },
    }))
  },
}

// Event operations
export const eventOperations = {
  async create(event: Event): Promise<void> {
    const item = createDynamoDBItem(
      TABLES.EVENTS,
      event,
      `EVENT#${event.id}`,
      `EVENT#${event.slug}`,
      `AUTHOR#${event.authorName}`,
      `EVENT#${event.startDate}`
    )
    
    await dynamoClient.send(new PutCommand({
      TableName: TABLES.EVENTS,
      Item: item,
    }))
  },

  async getPublished(): Promise<Event[]> {
    const result = await dynamoClient.send(new ScanCommand({
      TableName: TABLES.EVENTS,
      FilterExpression: 'data.published = :published',
      ExpressionAttributeValues: {
        ':published': true,
      },
    }))

    return result.Items?.map(item => item.data as Event) || []
  },
}

// Gallery operations
export const galleryOperations = {
  async create(gallery: Gallery): Promise<void> {
    const item = createDynamoDBItem(
      TABLES.GALLERIES,
      gallery,
      `GALLERY#${gallery.id}`,
      `GALLERY#${gallery.id}`,
      `AUTHOR#${gallery.authorName}`,
      `GALLERY#${gallery.createdAt}`
    )
    
    await dynamoClient.send(new PutCommand({
      TableName: TABLES.GALLERIES,
      Item: item,
    }))
  },

  async getById(id: string): Promise<Gallery | null> {
    const result = await dynamoClient.send(new GetCommand({
      TableName: TABLES.GALLERIES,
      Key: {
        PK: `GALLERY#${id}`,
        SK: `GALLERY#${id}`,
      },
    }))

    return result.Item?.data as Gallery || null
  },
}

// Contact operations
export const contactOperations = {
  async create(contact: Contact): Promise<void> {
    const item = createDynamoDBItem(
      TABLES.CONTACTS,
      contact,
      `CONTACT#${contact.id}`,
      `CONTACT#${contact.createdAt}`,
      `STATUS#${contact.read ? 'READ' : 'UNREAD'}`,
      `CONTACT#${contact.createdAt}`
    )
    
    await dynamoClient.send(new PutCommand({
      TableName: TABLES.CONTACTS,
      Item: item,
    }))
  },
}
