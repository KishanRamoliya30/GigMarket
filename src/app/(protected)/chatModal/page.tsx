import ChatModalComponent from "@/components/chatMessage/ChatModalComponent";

export interface ChatModalProps {
  open: boolean;
  onClose: () => void;
  gigId: string;
  user1Id: string;
}

const ChatModal: React.FC<ChatModalProps> = ({
  open,
  onClose,
  gigId,
  user1Id,
}) => {

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

export default ChatModal;