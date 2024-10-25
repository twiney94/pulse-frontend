import {
  CalendarIcon,
  ChevronsUpDown,
  Check,
  Volleyball,
  Music,
  Palette,
  Utensils,
  Beer,
  PartyPopper,
  GraduationCap,
  Briefcase,
  Heart,
  Users,
  User,
  MoreHorizontal,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import type { tags } from "@/app/types/d";

export const tagOptions: Array<{
  label: string;
  value: tags;
  icon: JSX.Element;
}> = [
  {
    label: "Sport",
    value: "sport",
    icon: <Volleyball className="mr-2 h-4 w-4" />,
  },
  {
    label: "Culture",
    value: "culture",
    icon: <Palette className="mr-2 h-4 w-4" />,
  },
  { label: "Music", value: "music", icon: <Music className="mr-2 h-4 w-4" /> },
  { label: "Art", value: "art", icon: <Palette className="mr-2 h-4 w-4" /> },
  { label: "Food", value: "food", icon: <Utensils className="mr-2 h-4 w-4" /> },
  { label: "Drink", value: "drink", icon: <Beer className="mr-2 h-4 w-4" /> },
  {
    label: "Party",
    value: "party",
    icon: <PartyPopper className="mr-2 h-4 w-4" />,
  },
  {
    label: "Education",
    value: "education",
    icon: <GraduationCap className="mr-2 h-4 w-4" />,
  },
  {
    label: "Business",
    value: "business",
    icon: <Briefcase className="mr-2 h-4 w-4" />,
  },
  {
    label: "Charity",
    value: "charity",
    icon: <Heart className="mr-2 h-4 w-4" />,
  },
  {
    label: "Family",
    value: "family",
    icon: <Users className="mr-2 h-4 w-4" />,
  },
  {
    label: "Friends",
    value: "friends",
    icon: <User className="mr-2 h-4 w-4" />,
  },
  {
    label: "Other",
    value: "other",
    icon: <MoreHorizontal className="mr-2 h-4 w-4" />,
  },
];

import React from "react";

interface TagOptionsProps {
  tags: [string];
}

const TagOptions: React.FC<TagOptionsProps> = ({ tags }): JSX.Element => {
  return (
    <div>
      {tags.map((tag) => {
        const tagOption = tagOptions.find((option) => option.value === tag);
        return (
          <Badge
            key={tag}
            className="mr-1 bg-gradient-to-br from-red-500 to-blue-500 bg-grad"
          >
            {tagOption?.icon}
            {tagOption?.label}
          </Badge>
        );
      })}
    </div>
  );
};

export default TagOptions;
