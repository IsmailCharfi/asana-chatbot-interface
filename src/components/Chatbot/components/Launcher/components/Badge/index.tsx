import "./style.scss";

type Props = {
  badge: number
}

function Badge({ badge }: Props) {
  return badge > 0 ? <span className="asana-chat-badge">{badge}</span> : null;
}

export default Badge;
