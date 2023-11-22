import {
  OutputSchema as RepoEvent,
  isCommit,
} from './lexicon/types/com/atproto/sync/subscribeRepos'
import { FirehoseSubscriptionBase, getOpsByType } from './util/subscription'

export class FirehoseSubscription extends FirehoseSubscriptionBase {
  async handleEvent(evt: RepoEvent) {
    if (!isCommit(evt)) return
    const ops = await getOpsByType(evt)

    // This logs the text of every post off the firehose.
    // Just for fun :)
    // Delete before actually using
    // for (const post of ops.posts.creates) {
    //   console.log(post.record.text)
    // }

    const postsToDelete = ops.posts.deletes.map((del) => del.uri)
    const postsToCreate = ops.posts.creates
      .filter((create) => {
        // only alf-related posts
        return create.record.text.toLowerCase().includes('猛禽') || 
        create.record.text.toLowerCase().includes('フクロウ') ||
        create.record.text.toLowerCase().includes('ふくろう') ||
        create.record.text.toLowerCase().includes('オオタカ') ||
        create.record.text.toLowerCase().includes('オオワシ') ||
        create.record.text.toLowerCase().includes('トンビ') ||
        create.record.text.toLowerCase().includes('オジロワシ') ||
        create.record.text.toLowerCase().includes('チョウゲンボウ') ||
        create.record.text.toLowerCase().includes('チュウヒ') ||
        create.record.text.toLowerCase().includes('イヌワシ') ||
        create.record.text.toLowerCase().includes('ノスリ') ||
        create.record.text.toLowerCase().includes('ハヤブサ') ||
        create.record.text.toLowerCase().includes('ハクトウワシ')||
        create.record.text.toLowerCase().includes('ミミズク') ||
        create.record.text.toLowerCase().includes('みみずく')
      })
      .map((create) => {
        // map alf-related posts to a db row
        return {
          uri: create.uri,
          cid: create.cid,
          replyParent: create.record?.reply?.parent.uri ?? null,
          replyRoot: create.record?.reply?.root.uri ?? null,
          indexedAt: new Date().toISOString(),
        }
      })

    if (postsToDelete.length > 0) {
      await this.db
        .deleteFrom('post')
        .where('uri', 'in', postsToDelete)
        .execute()
    }
    if (postsToCreate.length > 0) {
      await this.db
        .insertInto('post')
        .values(postsToCreate)
        .onConflict((oc) => oc.doNothing())
        .execute()
    }
  }
}
