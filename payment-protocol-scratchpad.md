Commitment tx: [][]

A adds payment 0
A adds payment 1

B adds payment 0

A: current [][] stagedLocal [0 1]  stagedRemote [0] 
B: current [][] stagedLocal [0]    stagedRemote [0 1]

A sends commit, with signatures for new state
B adds payments [0 1] to current commitment, updates signatures
B sends revocation for previous state

-- At this point B is locked in into the updates - A still has an unrevoked transaction, allowing A to reverse the payments

A: current [][]     stagedLocal [0 1]   stagedRemote [0] 
B: current [][0 1]  stagedLocal [0]     stagedRemote []

B sends commit, with signatures


UPDATE:
When a node first sends an update, it adds it to its remote unacked list.
When a node receives an update, it adds it to its local unacked list. This mirrors the above, so both sides have the same lists (my remote = your local, and vice versa).

COMMIT:
When a node sends a commitment, it first applies everything in its remote lists: both acked and unacked.
When a node receives a commitment, it applies everything in its local lists: both acked and unacked. 

REVOKE:
When a node sends the revocation preimage, it copies its local unacked list (ie. all the changes you sent me) into it's remote acked list.
When a node receives the revocation preimage, it copies its remote unacked list (ie. all the changes it send in step 3) into its local acked list.


We have three lists
committed
acked
unacked

for 

local
remote

committed
  local  - HTLCs that are in our current commitment tx
  remote - HTLCs that are in their current commitment tx
  
acked
  local  - Updates I sent to you, for which you ACKed receivement. Need to save last id before sending commitment to copy updates into this list from the unacked one. When you send me a new commitment tx, I consider these to be part of it.  
  remote - Updates you sent to me, for which I ACKed receivement. When I send you a new commitment, you expect these updates to be part of it.
  
unacked
  local  - Updates I received from you, but I haven't sent you an ACK for these yet. If I send a new commitment, these will not be included yet.
  remote - Updates I sent you that you haven't ACKed yet. I assume them to be missing in new commitiments.
  
A sends add 1
  A unacked remote 1

B receives add 1
  B unacked local 1

A sends commit
A sends HTLC with 1

B receives commit
B receives HTLC with 1

B sends ack
  B acked remote 1

A receives ack
  A acked local 1
  A commit remote 1


...

B sends commit


So we need 8 lists on every side

local:
  committed: HTLCs that I committed to by sending ACK (list of I/O ids) - copy into here from unacked-committed local
  unacked: Updates YOU sent me that that aren't ACKed yet
  unacked-committed: Updates YOU sent me that I haven't ACKed yet (not really useful?)
  acked: Updates I sent you that you ACKed, but aren't in my commitment yet
remote:
  committed: HTLCs that You committed to by sending ACK (list of I/O ids)
  
  
  
  
  
  
A sends addA1
B sends addB1

A unack remote addA1
A unack local addB1

B unack remote addB1
B unack local addA1

A sends commit
---
move remote ack/unack into remote staged
A staged remote addA1

move local ack/unack into local staged
B staged local addA1
---

B sends ackrevoke
---
move local staged into remote ack
B ack remote addA1

move remote staged into local ack
A ack local addA1
---

B sends commit
---
move remote ack/unack into remote staged
B staged remote addA1 addB1

move local ack/unack into local staged
A staged local addA1 addB1
---

A sends ackrevoke
---
move local staged into remote ack
A remote ack 










  

