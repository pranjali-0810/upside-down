const { createClient } = supabase

// CLEAN REPLACEMENT
const supabaseUrl = 'https://zvgocuixqswhkyljmfil.supabase.co' 
const supabaseKey = 'sb_publishable_yCXj9yzwUvR9V8dwfRAMaQ_qE2qiHXc' 

const _supabase = createClient(supabaseUrl, supabaseKey)

const feed = document.getElementById('feed')
const input = document.getElementById('message-input')

// LISTEN FOR REALTIME SIGNALS
_supabase
  .channel('public:signals')
  .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'signals' }, payload => {
    console.log("New signal received!", payload.new)
    renderMessage(payload.new.content)
  })
  .subscribe()

function renderMessage(text) {
  const div = document.createElement('div')
  div.className = 'message-flicker'
  div.innerHTML = `> SIGNAL RECEIVED: ${text}`
  feed.prepend(div)
}

// SEND SIGNAL TO THE UPSIDE DOWN
window.sendSignal = async function() {
  const text = input.value
  if (!text) return
  
  console.log("Attempting to send:", text)
  const { error } = await _supabase.from('signals').insert([{ content: text }])
  
  if (error) {
      console.error("Transmission Failed:", error.message)
  } else {
      input.value = ''
  }
}
function renderMessage(text) {
  // Add this line to clear the 'Waiting' text
  const waitingMsg = document.querySelector('.message-flicker:last-child');
  if (waitingMsg && waitingMsg.innerText.includes("WAITING")) waitingMsg.remove();

  const div = document.createElement('div')
  div.className = 'message-flicker'
  div.innerHTML = `> SIGNAL RECEIVED: ${text}`
  feed.prepend(div)
}