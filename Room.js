/** Chat rooms that can be joined/left/broadcast to. */

// in-memory storage of roomNames -> room

const ROOMS = new Map();

/** Room is a collection of listening members; this becomes a "chat room"
 *   where individual users can join/leave/broadcast to.
 */

class Room {
  /** get room by that name, creating if nonexistent
   *
   * This uses a programming pattern often called a "registry" ---
   * users of this class only need to .get to find a room; they don't
   * need to know about the ROOMS variable that holds the rooms. To
   * them, the Room class manages all of this stuff for them.
   **/

  static get(roomName) {
    if (!ROOMS.has(roomName)) {
      ROOMS.set(roomName, new Room(roomName));
    }

    return ROOMS.get(roomName);
  }

  /** make a new room, starting with empty set of listeners */

  constructor(roomName) {
    this.name = roomName;
    this.members = new Set();
  }

  /** member joining a room. */

  join(member) {
    this.members.add(member);
  }

  /** member leaving a room. */

  leave(member) {
    this.members.delete(member);
  }

  /** send message to all members in a room. */

  broadcast(data) {
    for (let member of this.members) {
      console.log('values', this.members.values());
      member.send(JSON.stringify(data));
    }
  }

  /** send joke to requesting user. */

  tellJoke(data) {
    let user;
    for (let member of this.members) {
      if (member.name === data.name) {
        user = member;
        break;
      }
    }
      user.send(JSON.stringify({type: 'joke', text: 'why did the chicken cross the road? to get to the other side!'}));
  }

  /** send list of all room members to requesting user */

  listRoomMembers(data) {
    let members = [];
    let user;
    for (let member of this.members.values()) {
      if (member.name === data.name) {
        user = member;
      }
      members.push(member.name);
    }
    user.send(JSON.stringify({type: 'members', text: members}));
  }

  private(data) {
    let user;
    let me;
    for (let member of this.members.values()) {
      if (member.name === data.user) {
        user = member;
      } else if (member.name === data.me) {
        me = member;
      } else if (user !== undefined && me !== undefined) {
        break;
      }
    }
    user.send(JSON.stringify({type: 'private', text: `private msg from ${data.me}: ` + data.text}));
    me.send(JSON.stringify({type: 'private', text: `private msg to ${data.user}: ` + data.text}));
  }
}

module.exports = Room;
