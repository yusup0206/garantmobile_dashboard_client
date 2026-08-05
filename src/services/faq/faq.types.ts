export type FaqEntry = {
  id: string;
  questionTk: string;
  answerTk: string;
  questionRu: string;
  answerRu: string;
  isPublished: boolean;
  chatVisible: boolean;
  created?: string;
};

export type CreateFaqDto = {
  questionTk: string;
  answerTk: string;
  questionRu: string;
  answerRu: string;
  isPublished: boolean;
  chatVisible: boolean;
};

export type EditFaqDto = CreateFaqDto;

export type GetFaqParams = {
  isPublished?: boolean;
  chatVisible?: boolean;
  page?: number;
  pageSize?: number;
  search?: string;
  lang?: string;
};

export type DeleteFaqResponse = {
  deleted: boolean;
};
