import {
  Count,
  CountSchema,
  Filter,
  repository,
  Where,
} from '@loopback/repository';
import {
  del,
  get,
  getModelSchemaRef,
  getWhereSchemaFor,
  param,
  patch,
  post,
  requestBody,
} from '@loopback/rest';
import {authenticate, STRATEGY} from 'loopback4-authentication';
import {authorize} from 'loopback4-authorization';
import {Calendar, WorkingHour} from '../models';
import {PermissionKey} from '../models/enums/permission-key.enum';
import {CalendarRepository} from '../repositories';

const basePath = '/calendars/{id}/working-hours';

export class CalendarWorkingHourController {
  constructor(
    @repository(CalendarRepository)
    protected calendarRepository: CalendarRepository,
  ) {}

  @authenticate(STRATEGY.BEARER, {
    passReqToCallback: true,
  })
  @authorize([PermissionKey.ViewWorkingHour])
  @get(basePath, {
    responses: {
      '200': {
        description: 'Array of Calendar has many WorkingHour',
        content: {
          'application/json': {
            schema: {type: 'array', items: getModelSchemaRef(WorkingHour)},
          },
        },
      },
    },
  })
  async find(
    @param.path.string('id') id: string,
    @param.query.object('filter') filter?: Filter<WorkingHour>,
  ): Promise<WorkingHour[]> {
    return this.calendarRepository.workingHours(id).find(filter);
  }

  @authenticate(STRATEGY.BEARER, {
    passReqToCallback: true,
  })
  @authorize([PermissionKey.CreateWorkingHour])
  @post(basePath, {
    responses: {
      '200': {
        description: 'Calendar model instance',
        content: {'application/json': {schema: getModelSchemaRef(WorkingHour)}},
      },
    },
  })
  async create(
    @param.path.string('id') id: typeof Calendar.prototype.id,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(WorkingHour, {
            title: 'NewWorkingHourInCalendar',
            exclude: ['id'],
            optional: ['calendarId'],
          }),
        },
      },
    })
    workingHour: Omit<WorkingHour, 'id'>,
  ): Promise<WorkingHour> {
    return this.calendarRepository.workingHours(id).create(workingHour);
  }

  @authenticate(STRATEGY.BEARER, {
    passReqToCallback: true,
  })
  @authorize([PermissionKey.UpdateWorkingHour])
  @patch(basePath, {
    responses: {
      '200': {
        description: 'Calendar.WorkingHour PATCH success count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async patch(
    @param.path.string('id') id: string,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(WorkingHour, {partial: true}),
        },
      },
    })
    workingHour: Partial<WorkingHour>,
    @param.query.object('where', getWhereSchemaFor(WorkingHour))
    where?: Where<WorkingHour>,
  ): Promise<Count> {
    return this.calendarRepository.workingHours(id).patch(workingHour, where);
  }

  @authenticate(STRATEGY.BEARER, {
    passReqToCallback: true,
  })
  @authorize([PermissionKey.DeleteWorkingHour])
  @del(basePath, {
    responses: {
      '200': {
        description: 'Calendar.WorkingHour DELETE success count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async delete(
    @param.path.string('id') id: string,
    @param.query.object('where', getWhereSchemaFor(WorkingHour))
    where?: Where<WorkingHour>,
  ): Promise<Count> {
    return this.calendarRepository.workingHours(id).delete(where);
  }
}