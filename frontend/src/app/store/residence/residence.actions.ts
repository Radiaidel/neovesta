import { createAction, props } from "@ngrx/store"
import type {
  CreateResidenceRequest,
  Document,
  DocumentUpload,
  PageResponse,
  Residence,
  ResidenceFilters,
  UpdateResidenceRequest,
} from "../../models/residence.model"

export const loadResidences = createAction(
  '[Residence] Load Residences',
  props<{ filters: ResidenceFilters }>()
)

export const loadResidencesSuccess = createAction(
  '[Residence] Load Residences Success',
  props<{ response: PageResponse<Residence> }>()
)

export const loadResidencesFailure = createAction(
  '[Residence] Load Residences Failure',
  props<{ error: any }>()
)

export const loadResidence = createAction(
  '[Residence] Load Residence',
  props<{ id: string }>()
)

export const loadResidenceSuccess = createAction(
  '[Residence] Load Residence Success',
  props<{ residence: Residence }>()
)

export const loadResidenceFailure = createAction(
  '[Residence] Load Residence Failure',
  props<{ error: any }>()
)

export const createResidence = createAction(
  '[Residence] Create Residence',
  props<{ residence: CreateResidenceRequest }>()
)

export const createResidenceSuccess = createAction(
  '[Residence] Create Residence Success',
  props<{ residence: Residence }>()
)

export const createResidenceFailure = createAction(
  '[Residence] Create Residence Failure',
  props<{ error: any }>()
)

export const createResidenceWithFiles = createAction(
  '[Residence] Create Residence With Files',
  props<{
    residence: CreateResidenceRequest
    images: File[]
    documents: DocumentUpload[]
  }>()
)

export const updateResidence = createAction(
  '[Residence] Update Residence',
  props<{ id: string; residence: UpdateResidenceRequest }>()
)

export const updateResidenceSuccess = createAction(
  '[Residence] Update Residence Success',
  props<{ residence: Residence }>()
)

export const updateResidenceFailure = createAction(
  '[Residence] Update Residence Failure',
  props<{ error: any }>()
)

export const updateResidenceWithFiles = createAction(
  '[Residence] Update Residence With Files',
  props<{
    id: string
    residence: UpdateResidenceRequest
    images: File[]
    documents: DocumentUpload[]
    existingImageUrls: string[]
    existingDocuments: Document[]
  }>()
)

export const deleteResidence = createAction(
  '[Residence] Delete Residence',
  props<{ id: string }>()
)

export const deleteResidenceSuccess = createAction(
  '[Residence] Delete Residence Success',
  props<{ id: string }>()
)

export const deleteResidenceFailure = createAction(
  '[Residence] Delete Residence Failure',
  props<{ error: any }>()
)

export const loadCities = createAction(
  '[Residence] Load Cities',
  props<{ page: number; size: number }>()
)

export const loadCitiesSuccess = createAction(
  '[Residence] Load Cities Success',
  props<{ response: PageResponse<string> }>()
)

export const loadCitiesFailure = createAction(
  '[Residence] Load Cities Failure',
  props<{ error: any }>()
)

export const resetSelectedResidence = createAction(
  '[Residence] Reset Selected Residence'
)

export const setFilters = createAction(
  '[Residence] Set Filters',
  props<{ filters: Partial<ResidenceFilters> }>()
)

export const resetFilters = createAction(
  '[Residence] Reset Filters'
)
export const loadManagerResidence = createAction(
  '[Residence] Load Manager Residence'
);

export const loadManagerResidenceSuccess = createAction(
  '[Residence] Load Manager Residence Success',
  props<{ residence: Residence }>()
);

export const loadManagerResidenceFailure = createAction(
  '[Residence] Load Manager Residence Failure',
  props<{ error: any }>()
);
export const ResidenceActions = {
  loadResidences,
  loadResidencesSuccess,
  loadResidencesFailure,
  loadResidence,
  loadResidenceSuccess,
  loadResidenceFailure,
  createResidence,
  createResidenceSuccess,
  createResidenceFailure,
  createResidenceWithFiles,
  updateResidence,
  updateResidenceSuccess,
  resetFilters,
  loadManagerResidence,
  loadManagerResidenceSuccess,
  loadManagerResidenceFailure,
  updateResidenceWithFiles,
  deleteResidence,
  deleteResidenceSuccess,
  deleteResidenceFailure,
  loadCities,
  loadCitiesSuccess,
  loadCitiesFailure,
  resetSelectedResidence,
  setFilters,
}
