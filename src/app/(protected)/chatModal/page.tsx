import ChatModalComponent from "@/components/chatMessage/ChatModalComponent";


export default function ChatModal({ open, onClose, gigId, user1Id }: any) {
  return (
    <div>
      <ChatModalComponent
        open={open}
        onClose={onClose}
        gigId={gigId}
        user1Id={user1Id}
        key={open + user1Id}
      />
    </div>
  );
}